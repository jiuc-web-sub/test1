import { uploadFile } from '../../services/api';

export default function FileUpload({ onSuccess }) {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    try {
      const fileUrl = await uploadFile(file); // API调用
      onSuccess(fileUrl);
    } catch (err) {
      console.error('上传失败:', err);
    }
  };

  return (
    <div className="file-upload">
      <input type="file" onChange={handleUpload} />
    </div>
  );
}