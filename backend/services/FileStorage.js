// File Storage System Handles file uploads, versioning, hashing, and metadata management
const crypto = require('crypto');
class FileStorage {
  constructor() {
    this.files = new Map(); // filename -> file data
    this.versions = new Map(); // filename -> version history
    this.contentHashes = new Map(); // hash -> fileId
    this.metadata = new Map(); // fileId -> metadata
    this.stats = {
      filesUploaded: 0,
      totalSize: 0,
      operations: []
    };
  }

  // Upload a file with content hashing and metadata
  uploadFile(filename, content, mimeType = 'text/plain') {
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const hash = this._hashContent(content);
    
    // Check for duplicates
    if (this.contentHashes.has(hash)) {
      return {
        success: false,
        message: 'File with identical content already exists',
        existingFileId: this.contentHashes.get(hash)
      };
    }

    // Initialize file
    if (!this.versions.has(filename)) {
      this.versions.set(filename, []);
    }

    const fileData = {
      id: fileId,
      filename,
      content,
      hash,
      size: Buffer.byteLength(content),
      mimeType,
      uploadedAt: Date.now(),
      version: this.versions.get(filename).length + 1
    };

    this.files.set(fileId, fileData);
    this.contentHashes.set(hash, fileId);
    this.versions.get(filename).push(fileId);
    
    this.metadata.set(fileId, {
      id: fileId,
      filename,
      hash,
      size: fileData.size,
      mimeType,
      uploadedAt: fileData.uploadedAt,
      version: fileData.version,
      wordCount: this._countWords(content),
      preview: content.substring(0, 200)
    });

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
      metadata: this.metadata.get(fileId)
    };
  }

  // Get file by ID
  getFile(fileId) {
    if (!this.files.has(fileId)) {
      return null;
    }

    const file = this.files.get(fileId);
    this.stats.operations.push({
      type: 'retrieve',
      fileId,
      filename: file.filename,
      timestamp: Date.now()
    });

    return file;
  }

  // Get file version history
  getVersionHistory(filename) {
    if (!this.versions.has(filename)) {
      return [];
    }

    return this.versions.get(filename).map(fileId => 
      this.metadata.get(fileId)
    );
  }

  // Delete a file
  deleteFile(fileId) {
    if (!this.files.has(fileId)) {
      return false;
    }

    const file = this.files.get(fileId);
    this.files.delete(fileId);
    this.contentHashes.delete(file.hash);
    this.metadata.delete(fileId);

    // Remove from versions
    if (this.versions.has(file.filename)) {
      const versions = this.versions.get(file.filename);
      const idx = versions.indexOf(fileId);
      if (idx > -1) {
        versions.splice(idx, 1);
      }
      if (versions.length === 0) {
        this.versions.delete(file.filename);
      }
    }

    this.stats.operations.push({
      type: 'delete',
      fileId,
      filename: file.filename,
      timestamp: Date.now()
    });

    return true;
  }

  // Get all files metadata
  getAllFiles() {
    return Array.from(this.metadata.values());
  }

  // Get file statistics
  getStats() {
    return {
      ...this.stats,
      operations: this.stats.operations.slice(-30),
      totalFiles: this.files.size,
      uniqueHashes: this.contentHashes.size
    };
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

  clear() {
    this.files.clear();
    this.versions.clear();
    this.contentHashes.clear();
    this.metadata.clear();
    this.stats = {
      filesUploaded: 0,
      totalSize: 0,
      operations: []
    };
  }
}

module.exports = FileStorage;
