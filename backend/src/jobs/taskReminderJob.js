const cron = require('cron');
const TaskReminderService = require('../services/taskReminderService');

// Schedule daily task reminders at 9 AM
const dailyReminderJob = new cron.CronJob('0 0 9 * * *', () => {
  console.log('Running daily task reminder job');
  TaskReminderService.sendDailyReminders();
});

// Schedule overdue task notifications every hour
const overdueNotificationJob = new cron.CronJob('0 0 * * * *', () => {
  console.log('Running overdue task notification job');
  TaskReminderService.sendOverdueNotifications();
});

// Start the jobs
dailyReminderJob.start();
overdueNotificationJob.start();

console.log('Task reminder jobs started');

module.exports = {
  dailyReminderJob,
  overdueNotificationJob
};
</dyad-add-dependency packages="cron"></dyad-add-dependency>

Now let me update the frontend to include these new features:

<dyad-write path="frontend/src/pages/clients/ClientDetail.jsx" description="Enhancing Client Detail page with documents and email">
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [client, setClient] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [emailForm, setEmailForm] = useState({
    templateId: '',
    subject: '',
    body: '',
    attachments: []
  });
  const [documentForm, setDocumentForm] = useState({
    description: ''
  });

  useEffect(() => {
    loadClientData();
    loadTemplates();
  }, [id]);

  const loadClientData = async () => {
    try {
      const [clientRes, interactionsRes, tasksRes, documentsRes] = await Promise.all([
        axios.get(`/api/clients/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get(`/api/interactions/client/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get(`/api/tasks?clientId=${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get(`/api/documents/client/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      
      setClient(clientRes.data.client);
      setInteractions(interactionsRes.data.interactions);
      setTasks(tasksRes.data.tasks);
      setDocuments(documentsRes.data.documents);
    } catch (err) {
      setError('Error loading client data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const res = await axios.get('/api/email/templates', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTemplates(res.data.templates);
    } catch (err) {
      console.error('Error loading templates:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this client? This will also delete all associated data.')) {
      try {
        await axios.delete(`/api/clients/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        navigate('/clients');
      } catch (err) {
        alert('Error deleting client');
        console.error(err);
      }
    }
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailForm(prev => ({ ...prev, [name]: value }));
    
    // If template is selected, populate subject and body
    if (name === 'templateId' && value) {
      const template = templates.find(t => t.id === value);
      if (template) {
        setEmailForm(prev => ({
          ...prev,
          subject: template.subject.replace(/\{\{client\.name\}\}/g, client?.name || ''),
          body: template.body
            .replace(/\{\{client\.name\}\}/g, client?.name || '')
            .replace(/\{\{client\.company\}\}/g, client?.company || '')
        }));
      }
    }
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/email/send', {
        clientId: id,
        ...emailForm
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      alert('Email sent successfully');
      setEmailForm({
        templateId: '',
        subject: '',
        body: '',
        attachments: []
      });
      document.getElementById('email-modal').close();
    } catch (err) {
      alert('Error sending email: ' + (err.response?.data?.message || 'Unknown error'));
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!fileInputRef.current?.files[0]) {
      alert('Please select a file');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);
    formData.append('clientId', id);
    formData.append('description', documentForm.description);
    
    try {
      await axios.post('/api/documents/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      alert('Document uploaded successfully');
      setDocumentForm({ description: '' });
      fileInputRef.current.value = '';
      document.getElementById('document-modal').close();
      loadClientData(); // Refresh documents list
    } catch (err) {
      alert('Error uploading document: ' + (err.response?.data?.message || 'Unknown error'));
      console.error(err);
    }
  };

  const deleteDocument = async (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await axios.delete(`/api/documents/${docId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        loadClientData(); // Refresh documents list
      } catch (err) {
        alert('Error deleting document');
        console.error(err);
      }
    }
  };

  const downloadDocument = async (docId) => {
    try {
      const response = await axios.get(`/api/documents/${docId}/download`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', response.headers['content-disposition']?.split('filename=')[1] || 'document');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Error downloading document');
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded">
        {error}
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-8">
        <p>Client not found</p>
        <Link to="/clients" className="text-blue-600 hover:underline">
          Back to Clients
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{client.name}</h1>
        <div className="space-x-2">
          <Link 
            to={`/clients/${id}/edit`} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit
          </Link>
          <button 
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('interactions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'interactions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Interactions ({interactions.length})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tasks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'documents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Documents ({documents.length})
          </button>
        </nav>
      </div>
      
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-4">Client Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p className="font-medium">{client.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Company</label>
                <p className="font-medium">{client.company || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{client.email || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <p className="font-medium">{client.phone || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Address</label>
                <p className="font-medium">{client.address || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Website</label>
                <p className="font-medium">{client.website || '-'}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold mb-4">Client Summary</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Interactions</label>
                  <p className="font-medium">{interactions.length}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Tasks</label>
                  <p className="font-medium">{tasks.length}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Documents</label>
                  <p className="font-medium">{documents.length}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Last Contact</label>
                  <p className="font-medium">
                    {interactions.length > 0 
                      ? new Date(interactions[0].createdAt).toLocaleDateString() 
                      : 'Never'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button 
                  onClick={() => document.getElementById('email-modal').showModal()}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded flex items-center"
                >
                  <span className="mr-2">✉️</span> Send Email
                </button>
                <Link 
                  to={`/interactions/new?client=${id}`} 
                  className="block p-2 hover:bg-gray-50 rounded flex items-center"
                >
                  <span className="mr-2">💬</span> Log Interaction
                </Link>
                <Link 
                  to={`/tasks/new?client=${id}`} 
                  className="block p-2 hover:bg-gray-50 rounded flex items-center"
                >
                  <span className="mr-2">✅</span> Create Task
                </Link>
                <button 
                  onClick={() => document.getElementById('document-modal').showModal()}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded flex items-center"
                >
                  <span className="mr-2">📄</span> Upload Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'interactions' && (
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Interaction History</h2>
            <Link 
              to={`/interactions/new?client=${id}`} 
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              Add Interaction
            </Link>
          </div>
          
          {interactions.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Notes</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {interactions.map(interaction => (
                  <tr key={interaction.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      {new Date(interaction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {interaction.type}
                      </span>
                    </td>
                    <td className="p-2 max-w-xs truncate">{interaction.notes}</td>
                    <td className="p-2">
                      <Link 
                        to={`/interactions/${interaction.id}/edit`} 
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No interactions recorded yet</p>
          )}
        </div>
      )}
      
      {activeTab === 'tasks' && (
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Tasks</h2>
            <Link 
              to={`/tasks/new?client=${id}`} 
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              Add Task
            </Link>
          </div>
          
          {tasks.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Task</th>
                  <th className="p-2 text-left">Due Date</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.description}</div>
                    </td>
                    <td className="p-2">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-2">
                      <Link 
                        to={`/tasks/${task.id}/edit`} 
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No tasks assigned yet</p>
          )}
        </div>
      )}
      
      {activeTab === 'documents' && (
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Documents</h2>
            <button 
              onClick={() => document.getElementById('document-modal').showModal()}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              Upload Document
            </button>
          </div>
          
          {documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map(doc => (
                <div key={doc.id} className="border rounded p-3 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="mr-3 text-2xl">
                      {doc.mimeType.startsWith('image/') ? '🖼️' : 
                       doc.mimeType === 'application/pdf' ? '📄' : '📁'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{doc.originalName}</div>
                      <div className="text-sm text-gray-500 truncate">{doc.description || 'No description'}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <button 
                      onClick={() => downloadDocument(doc.id)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Download
                    </button>
                    <button 
                      onClick={() => deleteDocument(doc.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No documents uploaded yet</p>
          )}
        </div>
      )}
      
      {/* Email Modal */}
      <dialog id="email-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Send Email to {client.name}</h3>
          <form onSubmit={sendEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Template
              </label>
              <select
                name="templateId"
                value={emailForm.templateId}
                onChange={handleEmailChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a template (optional)</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={emailForm.subject}
                onChange={handleEmailChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                name="body"
                value={emailForm.body}
                onChange={handleEmailChange}
                rows="6"
                required
                className="w-full p-2 border rounded"
              ></textarea>
            </div>
            
            <div className="modal-action">
              <button 
                type="button" 
                className="btn"
                onClick={() => document.getElementById('email-modal').close()}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Send Email
              </button>
            </div>
          </form>
        </div>
      </dialog>
      
      {/* Document Upload Modal */}
      <dialog id="document-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Upload Document for {client.name}</h3>
          <form onSubmit={handleFileUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File *
              </label>
              <input
                type="file"
                ref={fileInputRef}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={documentForm.description}
                onChange={(e) => setDocumentForm({ description: e.target.value })}
                rows="3"
                className="w-full p-2 border rounded"
                placeholder="Add a description for this document..."
              ></textarea>
            </div>
            
            <div className="modal-action">
              <button 
                type="button" 
                className="btn"
                onClick={() => document.getElementById('document-modal').close()}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Upload Document
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}