import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Reports() {
  const [activeTab, setActiveTab] = useState('overview');
  const [reportData, setReportData] = useState(null);
  const [interactionReport, setInteractionReport] = useState(null);
  const [taskReport, setTaskReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const [clientRes, interactionRes, taskRes] = await Promise.all([
        axios.get('/api/reports/clients', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/reports/interactions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/reports/tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      setReportData(clientRes.data.report);
      setInteractionReport(interactionRes.data.report);
      setTaskReport(taskRes.data.report);
    } catch (err) {
      console.error('Error loading reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const getClientOverviewData = () => {
    if (!reportData) return null;
    
    return {
      labels: ['Total Clients', 'With Interactions', 'With Tasks'],
      datasets: [{
        label: 'Clients',
        data: [
          reportData.overview.totalClients,
          reportData.overview.clientsWithInteractions,
          reportData.overview.clientsWithTasks
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }]
    };
  };

  const getInteractionTypeData = () => {
    if (!reportData) return null;
    
    const labels = Object.keys(reportData.interactionStats.byType);
    const data = Object.values(reportData.interactionStats.byType);
    
    return {
      labels,
      datasets: [{
        label: 'Interactions by Type',
        data,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }]
    };
  };

  const getTaskStatusData = () => {
    if (!reportData) return null;
    
    return {
      labels: ['Pending', 'In Progress', 'Completed'],
      datasets: [{
        label: 'Tasks by Status',
        data: [
          reportData.taskStats.byStatus.PENDING,
          reportData.taskStats.byStatus.IN_PROGRESS,
          reportData.taskStats.byStatus.COMPLETED
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }]
    };
  };

  const getInteractionTrendData = () => {
    if (!interactionReport) return null;
    
    const labels = interactionReport.chartData.map(item => item.date);
    const data = interactionReport.chartData.map(item => item.total);
    
    return {
      labels,
      datasets: [{
        label: 'Interactions',
        data,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports & Analytics</h1>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
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
              Interactions
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tasks
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'overview' && reportData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <div className="text-sm text-gray-500">Total Clients</div>
              <div className="text-3xl font-bold mt-2">{reportData.overview.totalClients}</div>
            </div>
            
            <div className="bg-white p-6 rounded shadow">
              <div className="text-sm text-gray-500">Total Interactions</div>
              <div className="text-3xl font-bold mt-2">{reportData.overview.totalInteractions}</div>
            </div>
            
            <div className="bg-white p-6 rounded shadow">
              <div className="text-sm text-gray-500">Total Tasks</div>
              <div className="text-3xl font-bold mt-2">{reportData.overview.totalTasks}</div>
            </div>
            
            <div className="bg-white p-6 rounded shadow">
              <div className="text-sm text-gray-500">Recent Activity</div>
              <div className="text-3xl font-bold mt-2">
                {reportData.recentActivity.newClients + 
                 reportData.recentActivity.interactions + 
                 reportData.recentActivity.tasks}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">Client Overview</h3>
              <Bar 
                data={getClientOverviewData()} 
                options={{ responsive: true, plugins: { legend: { display: false } } }} 
              />
            </div>
            
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">Interaction Types</h3>
              <Pie 
                data={getInteractionTypeData()} 
                options={{ responsive: true }} 
              />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Task Status Distribution</h3>
            <Bar 
              data={getTaskStatusData()} 
              options={{ responsive: true, plugins: { legend: { display: false } } }} 
            />
          </div>
        </div>
      )}
      
      {activeTab === 'interactions' && interactionReport && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <div className="text-sm text-gray-500">Total Interactions</div>
              <div className="text-3xl font-bold mt-2">{interactionReport.totalInteractions}</div>
            </div>
            
            <div className="bg-white p-6 rounded shadow">
              <div className="text-sm text-gray-500">Reporting Period</div>
              <div className="text-lg font-semibold mt-2">{interactionReport.period}</div>
            </div>
            
            <div className="bg-white p-6 rounded shadow">
              <div className="text-sm text-gray-500">Top Client</div>
              <div className="text-lg font-semibold mt-2">
                {interactionReport.topClients.length > 0 
                  ? interactionReport.topClients[0].client.name 
                  : 'N/A'}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Interaction Trend</h3>
            <Bar 
              data={getInteractionTrendData()} 
              options={{ responsive: true }} 
            />
          </div>
          
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Top Clients by Interactions</h3>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Client</th>
                  <th className="p-2 text-left">Company</th>
                  <th className="p-2 text-left">Interactions</th>
                </tr>
              </thead>
              <tbody>
                {interactionReport.topClients.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{item.client.name}</td>
                    <td className="p-2">{item.client.company || '-'}</td>
                    <td className="p-2">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'tasks' && taskReport && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <div className="text-sm text-gray-500">Total Tasks</div>
              <div className="text-3xl font-bold mt-2">{taskReport.totalTasks}</div>
            </div>
            
            <div className="bg-white p-6 rounded shadow">
              <div className="text-sm text-gray-500">Pending</div>
              <div className="text-3xl font-bold mt-2 text-red-500">
                {taskReport.byStatus.PENDING.length}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded shadow">
              <div className="text-sm text-gray-500">In Progress</div>
              <div className="text-3xl font-bold mt-2 text-yellow-500">
                {taskReport.byStatus.IN_PROGRESS.length}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded shadow">
              <div className="text-sm text-gray-500">Overdue</div>
              <div className="text-3xl font-bold mt-2 text-red-600">
                {taskReport.overdueTasks}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">Top Clients by Tasks</h3>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left">Client</th>
                    <th className="p-2 text-left">Company</th>
                    <th className="p-2 text-left">Tasks</th>
                  </tr>
                </thead>
                <tbody>
                  {taskReport.topClients.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{item.client.name}</td>
                      <td className="p-2">{item.client.company || '-'}</td>
                      <td className="p-2">{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">Task Distribution</h3>
              <Pie 
                data={getTaskStatusData()} 
                options={{ responsive: true }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}