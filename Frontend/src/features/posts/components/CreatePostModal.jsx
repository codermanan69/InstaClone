import React, { useState, useRef, useEffect } from 'react';
import { usePost } from '../hook/usePost';
import { useToast } from '../../shared/hooks/useToast';
import { CloseIcon, UploadIcon } from '../../shared/components/Icons';
import '../style/createpost.scss';

const CreatePostModal = ({ onClose }) => {
  const { handleCreatePost } = usePost();
  const toast = useToast();

  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Clean up object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [previewUrl]);

  const handleFile = (file) => {
    if (!file) return;

    // Validate type (must be image)
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be under 5MB');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelectChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please upload an image first");
      return;
    }
    if (caption.length > 2200) {
      toast.error("Caption is too long");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(10);

    // Simulate upload progress
    progressIntervalRef.current = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressIntervalRef.current);
          return 90;
        }
        return prev + 15;
      });
    }, 200);

    try {
      await handleCreatePost(selectedFile, caption.trim());
      setUploadProgress(100);
      toast.success("Post created successfully!");
      setTimeout(() => {
        onClose();
      }, 300);
    } catch (err) {
      console.error("Post Creation Error:", err);
      toast.error(err.response?.data?.message || "Failed to create post");
      setIsSubmitting(false);
      setUploadProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  };

  const captionCharLimit = 2200;
  const isLimitWarning = caption.length > captionCharLimit - 100 && caption.length <= captionCharLimit;
  const isLimitError = caption.length > captionCharLimit;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Post</h2>
          <button className="close-modal-btn" onClick={onClose} disabled={isSubmitting}>
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="post-create-form">
            
            {/* Image Upload Zone */}
            {!previewUrl ? (
              <div 
                className={`drag-drop-zone ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelectChange}
                  style={{ display: 'none' }}
                  accept="image/*"
                />
                <UploadIcon className="upload-icon" size={40} />
                <p>Drag and drop your photo here</p>
                <button type="button" className="select-file-btn">
                  Select from Computer
                </button>
              </div>
            ) : (
              <div className="image-preview-wrapper">
                <img src={previewUrl} alt="Upload preview" />
                {!isSubmitting && (
                  <button 
                    type="button" 
                    className="remove-preview-btn" 
                    onClick={handleRemoveImage}
                  >
                    <CloseIcon size={16} />
                  </button>
                )}
              </div>
            )}

            {/* Caption Form Group */}
            <div className="caption-input-group">
              <textarea
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                disabled={isSubmitting}
                maxLength={captionCharLimit + 50}
              />
              <div className={`counter-row ${isLimitError ? 'limit-err' : isLimitWarning ? 'limit-warn' : ''}`}>
                {caption.length.toLocaleString()} / {captionCharLimit.toLocaleString()}
              </div>
            </div>

            {/* Loading / Progress State */}
            {isSubmitting && (
              <div className="upload-progress-container">
                <div className="progress-label-row">
                  <span>Uploading post details...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="progress-bar-track">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button 
              type="submit" 
              className="submit-post-btn" 
              disabled={isSubmitting || !selectedFile || isLimitError}
            >
              {isSubmitting ? 'Sharing...' : 'Share'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
