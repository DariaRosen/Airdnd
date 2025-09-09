import { useState, useRef } from "react"

export function ImageUploader({ onImagesChange }) {
    const [images, setImages] = useState([])
    const fileInputRef = useRef(null)

    function handleImageUpload(e) {
        const files = Array.from(e.target.files)
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
        }))
        const updatedImages = [...images, ...newImages]

        setImages(updatedImages)

        if (onImagesChange) {
            onImagesChange(updatedImages.map(img => img.file))
        }
    }

    function handleRemove(index) {
        const updated = images.filter((_, i) => i !== index)
        setImages(updated)
        if (onImagesChange) onImagesChange(updated.map(img => img.file))
    }

    function handleCustomButtonClick() {
        fileInputRef.current.click()
    }

    return (
        <div className="image-uploader">
            <label className="block font-medium">Upload at least 5 images</label>

            {/* Hidden file input */}
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="hidden-file-input"
            />

            {/* Custom button */}
            <button
                type="button"
                onClick={handleCustomButtonClick}
                className="upload-btn"
            >
                Upload Images
            </button>

            {images.length < 5 && (
                <p className="text-red-500 text-sm">
                    Please upload at least 5 images. Currently: {images.length}
                </p>
            )}

            <div className="image-preview-grid">
                {images.map((img, idx) => (
                    <div key={idx} className="image-preview relative">
                        <img src={img.preview} alt={`preview-${idx}`} />
                        <button
                            type="button"
                            onClick={() => handleRemove(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
