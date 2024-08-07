import React from 'react';

interface UpdateInfoFormProps {
    formData: {
        username: string;
        email: string;
        dob: string;
        profile_pic: string;
    };
    profilePictureFile: File | null;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFormSubmit: (e: React.FormEvent) => void;
    setProfilePictureFile: (file: File | null) => void;
    closeModal: () => void;
    loading: boolean;
    error: string;
}

const UpdateInfoForm: React.FC<UpdateInfoFormProps> = ({
    formData,
    profilePictureFile,
    handleInputChange,
    handleFormSubmit,
    setProfilePictureFile,
    closeModal,
    loading,
    error
}) => {
    return (
        <div className="fixed flex items-center justify-center z-50 bg-black bg-opacity-50 h-full w-1/2">
            <div className="w-full h-1/2 max-w-lg bg-gray-800 shadow-md rounded px-8 pt-6 pb-8">
                <h2 className="text-xl font-bold text-white mb-4">Edit Profile</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                        <label className="block text-white mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white mb-2" htmlFor="dob">
                            Date of Birth
                        </label>
                        <input
                            id="dob"
                            name="dob"
                            type="date"
                            value={formData.dob.split('T')[0]}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white mb-2" htmlFor="profile_pic">
                            Profile Picture
                        </label>
                        {profilePictureFile && (
                            <div className="mb-2 text-white">
                                Selected file: {profilePictureFile.name}
                            </div>
                        )}
                        <input
                            id="profile_pic"
                            name="profile_pic"
                            type="file"
                            onChange={(e) => setProfilePictureFile(e.target.files ? e.target.files[0] : null)}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                        />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}

                    <div className="flex justify-end mt-10">
                        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" onClick={closeModal} className="ml-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700" disabled={loading}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateInfoForm;
