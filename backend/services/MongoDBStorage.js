// MongoDB Storage System for persistent file storage
const crypto = require('crypto');

class MongoDBStorage {
  constructor() {
    this.client = null;
    this.db = null;
    this.collection = null;
    this.connected = false;
    this.stats = {
      filesUploaded: 0,
      totalSize: 0,
      operations: []
    };
  }

  async connect(connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/core_system_atlas') {
    try {
      const { MongoClient } = require('mongodb');
      this.client = new MongoClient(connectionString);
      await this.client.connect();
      this.db = this.client.db();
      this.collection = this.db.collection('files');
      
      // Create indexes for efficient querying
      await this.collection.createIndex({ filename: 1 });
      await this.collection.createIndex({ hash: 1 });
      await this.collection.createIndex({ uploadedAt: -1 });
      
      this.connected = true;
      console.log('Connected to MongoDB successfully');
      
      // Load stats from existing data
      await this._loadStats();
      
      return { success: true, message: 'Connected to MongoDB' };
    } catch (error) {
      console.error('MongoDB connection failed:', error.message);
      this.connected = false;
      return { success: false, message: error.message };
    }
  }

  async _loadStats() {
    try {
      const totalSize = await this.collection.aggregate([
        { $group: { _id: null, total: { $sum: '$size' } } }
      ]).toArray();
      
      this.stats.totalSize = totalSize[0]?.total || 0;
      this.stats.filesUploaded = await this.collection.countDocuments();
    } catch (error) {
      console.error('Failed to load stats:', error.message);
    }
  }

  async uploadFile(filename, content, mimeType = 'text/plain') {
    if (!this.connected) {
      return { success: false, message: 'MongoDB not connected' };
    }

    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const hash = this._hashContent(content);
    
    try {
      // Check for duplicates
      const existingFile = await this.collection.findOne({ hash });
      if (existingFile) {
        return {
          success: false,
          message: 'File with identical content already exists',
          existingFileId: existingFile._id
        };
      }

      const fileData = {
        _id: fileId,
        filename,
        content,
        hash,
        size: Buffer.byteLength(content),
        mimeType,
        uploadedAt: Date.now(),
        version: await this._getNextVersion(filename) + 1
      };

      await this.collection.insertOne(fileData);
      
      const metadata = {
        id: fileId,
        filename,
        hash,
        size: fileData.size,
        mimeType,
        uploadedAt: fileData.uploadedAt,
        version: fileData.version,
        wordCount: this._countWords(content),
        preview: content.substring(0, 200)
      };

      // Update stats
      this.stats.filesUploaded++;
      this.stats.totalSize += fileData.size;
      
      this.stats.operations.push({
        type: 'upload',
        fileId,
        filename,
        size: fileData.size,
        timestamp: Date.now()
      });

      return {
        success: true,
        fileId,
        metadata
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async _getNextVersion(filename) {
    const latestFile = await this.collection
      .find({ filename })
      .sort({ version: -1 })
      .limit(1)
      .toArray();
    return latestFile[0]?.version || 0;
  }

  async getFile(fileId) {
    if (!this.connected) {
      return null;
    }

    try {
      const file = await this.collection.findOne({ _id: fileId });
      
      if (file) {
        this.stats.operations.push({
          type: 'retrieve',
          fileId,
          filename: file.filename,
          timestamp: Date.now()
        });
      }
      
      return file;
    } catch (error) {
      console.error('Failed to get file:', error.message);
      return null;
    }
  }

  async getVersionHistory(filename) {
    if (!this.connected) {
      return [];
    }

    try {
      return await this.collection
        .find({ filename })
        .sort({ version: -1 })
        .project({
          _id: 1,
          filename: 1,
          hash: 1,
          size: 1,
          mimeType: 1,
          uploadedAt: 1,
          version: 1
        })
        .toArray();
    } catch (error) {
      console.error('Failed to get version history:', error.message);
      return [];
    }
  }

  async deleteFile(fileId) {
    if (!this.connected) {
      return false;
    }

    try {
      const file = await this.collection.findOne({ _id: fileId });
      if (!file) {
        return false;
      }

      const result = await this.collection.deleteOne({ _id: fileId });
      
      if (result.deletedCount > 0) {
        this.stats.filesUploaded--;
        this.stats.totalSize -= file.size;
        
        this.stats.operations.push({
          type: 'delete',
          fileId,
          filename: file.filename,
          timestamp: Date.now()
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete file:', error.message);
      return false;
    }
  }

  async getAllFiles() {
    if (!this.connected) {
      return [];
    }

    try {
      return await this.collection
        .find({}, {
          projection: {
            content: 0 // Exclude content for list view
          }
        })
        .sort({ uploadedAt: -1 })
        .toArray();
    } catch (error) {
      console.error('Failed to get all files:', error.message);
      return [];
    }
  }

  async getStats() {
    if (!this.connected) {
      return {
        ...this.stats,
        totalFiles: 0,
        uniqueHashes: 0,
        storageType: 'mongodb',
        connected: false
      };
    }

    return {
      ...this.stats,
      totalFiles: this.stats.filesUploaded,
      uniqueHashes: await this.collection.distinct('hash').then(hashes => hashes.length),
      storageType: 'mongodb',
      connected: true
    };
  }

  async searchFiles(query) {
    if (!this.connected) {
      return [];
    }

    try {
      return await this.collection
        .find({
          $or: [
            { filename: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } }
          ]
        })
        .limit(20)
        .toArray();
    } catch (error) {
      console.error('Search failed:', error.message);
      return [];
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.connected = false;
      console.log('Disconnected from MongoDB');
    }
  }

  _hashContent(content) {
    return crypto
      .createHash('sha256')
      .update(content)
      .digest('hex')
      .substring(0, 16);
  }

  _countWords(text) {
    return text.split(/\s+/).filter(w => w.length > 0).length;
  }

  async clear() {
    if (this.connected) {
      await this.collection.deleteMany({});
      this.stats = {
        filesUploaded: 0,
        totalSize: 0,
        operations: []
      };
    }
  }
}

module.exports = MongoDBStorage;
