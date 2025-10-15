import { CheckCircleIcon, ArrowUpTrayIcon as UploadIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const feedbackSchema = z.object({
  category: z.string().min(1, 'Please select a category'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  priority: z.string().optional(),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
});

const categories = [
  {
    id: 'technical',
    name: 'Technical Issues',
    description: 'Report bugs, errors, or technical problems with the portal'
  },
  {
    id: 'process',
    name: 'Process Related',
    description: 'Questions about application procedures, documentation, or workflows'
  },
  {
    id: 'suggestions',
    name: 'Suggestions',
    description: 'Share ideas for improvements or new features'
  }
];

const priorities = [
  { id: 'low', name: 'Low', color: 'bg-green-100 text-green-800' },
  { id: 'medium', name: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'high', name: 'High', color: 'bg-red-100 text-red-800' },
  { id: 'urgent', name: 'Urgent', color: 'bg-red-200 text-red-900' }
];

export default function FeedbackForm({ onFeedbackSubmitted }) {
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      category: '',
      description: '',
      priority: 'medium',
      email: ''
    }
  });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = ['image/png', 'image/jpeg', 'application/pdf'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== selectedFiles.length) {
      alert('Some files were rejected. Only PNG, JPG, and PDF files up to 10MB are allowed.');
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create feedback object
      const feedback = {
        id: Date.now().toString(),
        ...data,
        files: files.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        })),
        status: 'pending',
        submittedAt: new Date().toISOString(),
        ticketNumber: `FB-${Date.now()}`
      };

      // Save to localStorage (simulating backend)
      const existingFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
      existingFeedback.push(feedback);
      localStorage.setItem('userFeedback', JSON.stringify(existingFeedback));

      setSubmitStatus({ type: 'success', message: `Feedback submitted successfully! Ticket #${feedback.ticketNumber}` });
      reset();
      setFiles([]);

      // Notify parent component to refresh feedback list
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);

    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Failed to submit feedback. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      {/* Section Header */}
      <div className="section-heading mb-6 -mx-6 -mt-6">
        <h2 className="text-xl font-bold text-gray-900">Submit Feedback</h2>
        <p className="text-sm text-gray-500 mt-1">
          Tell us about your issue or suggestion. We’d love to hear from you.
        </p>
      </div>

      {/* Status Message */}
      {submitStatus && (
        <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
          submitStatus.type === 'success'
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          {submitStatus.type === 'success' ? (
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
          ) : (
            <XCircleIcon className="w-5 h-5 text-red-600" />
          )}
          <p className={`text-sm ${
            submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {submitStatus.message}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Category Selection */}
        <div className="space-y-2">
          <Label htmlFor="category">
            Category <span className="text-red-500">*</span>
          </Label>
          <select
            {...register('category')}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-red-600">{errors.category.message}</p>
          )}
          {watch('category') && (
            <p className="text-sm text-gray-600 mt-1">
              {categories.find(cat => cat.id === watch('category'))?.description}
            </p>
          )}
        </div>

        {/* Priority Selection */}
        <div className="space-y-2">
          <Label htmlFor="priority">Priority Level</Label>
          <select
            {...register('priority')}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {priorities.map(priority => (
              <option key={priority.id} value={priority.id}>
                {priority.name}
              </option>
            ))}
          </select>
        </div>

        {/* Email (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address (Optional)</Label>
          <Input
            {...register('email')}
            type="email"
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-red-500">*</span>
          </Label>
          <textarea
            {...register('description')}
            rows={5}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            placeholder={
              watch('category') === 'technical'
                ? "Please describe the technical issue you're experiencing. Include steps to reproduce, error messages, and what you were doing when the issue occurred."
                : watch('category') === 'process'
                ? "Describe your question about the application process. Include specific steps you're unsure about or documentation you're having trouble understanding."
                : watch('category') === 'suggestions'
                ? "Share your idea for improvement or new feature. Explain how it would benefit users and why it's important."
                : "Please describe your feedback or issue in detail..."
            }
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
            <p className="text-xs text-gray-500 ml-auto">
              {watch('description')?.length || 0}/1000 characters
            </p>
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label>Attachments</Label>
          <div className="flex justify-center px-6 pt-6 pb-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
            <div className="space-y-2 text-center">
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex items-center justify-center text-sm text-gray-600">
                <label className="relative cursor-pointer rounded-md font-medium text-bg-1 hover:text-bg-heading">
                  <span className="underline">Upload files</span>
                  <input
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.pdf"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-2">or drag & drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB each</p>
            </div>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <Label>Uploaded Files</Label>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-white shadow-sm rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700"
                >
                  <span className="truncate max-w-[70%]">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium ml-2"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-semibold rounded-md shadow-md hover:shadow-lg transition"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </form>
    </div>
  );
}
