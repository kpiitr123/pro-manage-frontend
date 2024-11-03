import React, { useEffect, useState } from 'react';
import '../styles/Analytics.css';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

const Analytics = () => {
  const [tasks, setTasks] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    backlog: 0,
    todo: 0,
    progress: 0,
    done: 0,
    lowPriority: 0,
    moderatePriority: 0,
    highPriority: 0,
  });

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get(`/tasks`);
      setTasks(response.data);
    } catch (error) {
      toast.error('Error fetching tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const computeAnalytics = () => {
      const initialData = {
        backlog: 0,
        todo: 0,
        progress: 0,
        done: 0,
        lowPriority: 0,
        moderatePriority: 0,
        highPriority: 0,
      };

      tasks.forEach(task => {
        // Count by status
        console.log(task);
        switch (task.status) {
          case 'BACKLOG':
            initialData.backlog += 1;
            break;
          case 'TODO':
            initialData.todo += 1;
            break;
          case 'PROGRESS':
            initialData.progress += 1;
            break;
          case 'DONE':
            initialData.done += 1;
            break;
          default:
            break;
        }

        // Count by priority
        switch (task.priority) {
          case 'LOW':
            initialData.lowPriority += 1;
            break;
          case 'MODERATE':
            initialData.moderatePriority += 1;
            break;
          case 'HIGH':
            initialData.highPriority += 1;
            break;
          default:
            break;
        }
      });

      setAnalyticsData(initialData);
    };

    computeAnalytics();
  }, [tasks]);

  return (
    <div className="analytics-container">
      <h1>Analytics</h1>
      <div className="analytics-cards">
        <div className="analytics-card">
          <ul>
            <li>
              <div className="item">
                <span className="dot"></span>
                Backlog Tasks
              </div>
              <span className="count">{analyticsData.backlog}</span>
            </li>
            <li>
              <div className="item">
                <span className="dot"></span>
                To-do Tasks
              </div>
              <span className="count">{analyticsData.todo}</span>
            </li>
            <li>
              <div className="item">
                <span className="dot"></span>
                In-Progress Tasks
              </div>
              <span className="count">{analyticsData.progress}</span>
            </li>
            <li>
              <div className="item">
                <span className="dot"></span>
                Completed Tasks
              </div>
              <span className="count">{analyticsData.done}</span>
            </li>
          </ul>
        </div>
        <div className="analytics-card">
          <ul>
            <li>
              <div className="item">
                <span className="dot"></span>
                Low Priority
              </div>
              <span className="count">{analyticsData.lowPriority}</span>
            </li>
            <li>
              <div className="item">
                <span className="dot"></span>
                Moderate Priority
              </div>
              <span className="count">{analyticsData.moderatePriority}</span>
            </li>
            <li>
              <div className="item">
                <span className="dot"></span>
                High Priority
              </div>
              <span className="count">{analyticsData.highPriority}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
