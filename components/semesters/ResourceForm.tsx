"use client";
import React, { useState } from 'react';
import { cn } from '@/lib/utils';


type ResourceCat ='Notes'| 'PQ'| 'Assignments'| 'Links'| 'Others';
interface Resource
{
	name: string;
	category: ResourceCat;
	description: string;
}

export interface ResourceFormProps 
{
	subject_id: string;
	onSubmit: (formData: FormData) => void;
	onClose: () => void;
}

const ResourceForm: React.FC<ResourceFormProps> = (
{
	subject_id,
	onSubmit, 
	onClose, 
}) => 
{
	const [formValues, setFormValues] = useState<Resource>(
	{
		name: "",
		category: "Notes",
		description: "",
	});
	const [resourceFile, setResourceFile] = useState<File | null>(null);
	const [sending, setSending] =useState<boolean>(false);

	const handleSubmit = async (e: React.FormEvent) => 
	{
		setSending(true);
		e.preventDefault();
		const formData = new FormData();
		formData.append('subject_id', subject_id || '');
		formData.append('name', formValues.name);
		formData.append('category', formValues.category);
		formData.append('description', formValues.description);
		if (resourceFile) 
		{
			formData.append('resource', resourceFile);
		}
		console.log(formData);
		onSubmit(formData);
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80">
		<div className="bg-gray-900 p-6 rounded-lg w-full max-w-lg">


		<form onSubmit={handleSubmit}>

		<div className="mb-4">
		<label className="block text-white mb-2 font-sm">File title</label>
		<input
		type="text"
		value={formValues.name}
		onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
		className="w-full px-3 py-2 bg-gray-700 text-white rounded"
		required
		/>
		</div>

		<div className="mb-4">
		<label className="block text-white mb-2">Category</label>
		<select
		value={formValues.category}
		onChange={(e) => setFormValues({ ...formValues, category: e.target.value as ResourceCat })}
		className="w-full px-3 py-2 bg-gray-700 text-white rounded"
        required>
		<option value="Notes">Notes, Assignments</option>
		<option value="PQ">Past Questions, Resources</option>
		{/*
		<option value="Assignments">Assignments</option>
		<option value="Links">Links</option>
		<option value="Others">Others</option>
		*/}
		</select>
		</div>

		<div className="mb-4">
		<label className="block text-white mb-2">Description</label>
		<textarea
		value={formValues.description}
		onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
		className="w-full px-3 py-2 bg-gray-700 text-white rounded h-32 overflow-y-auto"
		required
		/>

		</div>

		<div className="mb-4">
		<label className="block text-white mb-2">Resource File</label>
		{resourceFile && (
			<div className="mb-2 text-white">
			Selected file: {resourceFile.name}
			</div>
		)}
		<input
		type="file"
		onChange={(e) => setResourceFile(e.target.files ? e.target.files[0] : null)}
		className="w-full px-3 py-2 bg-gray-700 text-white rounded"
		required
		/>
		</div>

		<div className="flex justify-end">
		<button
		type="submit"
		className={cn("px-4 py-2 text-white rounded",
					sending ? "bg-grey-600" : "bg-blue-600 hover:bg-blue-700")}
		disabled={sending}
		>
		{sending && "Submitting..." || "Submit"}
		</button>

		<button
		type="button"
		onClick={onClose}
		className={cn("ml-4 px-4 py-2 text-white rounded", 
					  sending ? "bg-grey-600" : "bg-red-600 hover:bg-red-700")}
		disabled={sending}
		>
		Cancel
		</button>
		</div>
		</form>
		</div>
		</div>
	);
};

export default React.memo(ResourceForm);
