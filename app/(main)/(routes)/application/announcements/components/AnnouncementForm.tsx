import React, { useState } from 'react';

interface AnnouncementFormProps {
  initialValues: Partial<Announcement>;
  onSubmit: (formData: FormData) => void;
  onClose: () => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ initialValues, onSubmit, onClose }) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', formValues.title || '');
    formData.append('message', formValues.message || '');
    formData.append('category', formValues.category || '');
    if (attachmentFile) {
      formData.append('attachment', attachmentFile);
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-xl font-bold text-white mb-4">
          {initialValues.announcement_id ? 'Update Announcement' : 'Add Announcement'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2">Title</label>
            <input
              type="text"
              value={formValues.title || ''}
              onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Message</label>
            <textarea
              value={formValues.message || ''}
              onChange={(e) => setFormValues({ ...formValues, message: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded h-32 overflow-y-auto"
              required
            />
          </div>
          {!formValues.announcement_id && (
            <div className="mb-4">
              <label className="block text-white mb-2">Attachment</label>
              {attachmentFile && (
                <div className="mb-2 text-white">
                  Selected file: {attachmentFile.name}
                </div>
              )}
              <input
                type="file"
                onChange={(e) => setAttachmentFile(e.target.files ? e.target.files[0] : null)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded"
              />
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {formValues.announcement_id ? 'Update' : 'Add'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementForm;
