/**
 * API service for chat functionality
 * @author MuNeeB Tech
 */


import axios from 'axios';
import type { Message } from '../types';

const isProduction = import.meta.env.PROD;

const API_BASE_URL = isProduction
  ? 'https://mental-healthsupportchatbot-bnbo.onrender.com'
  : 'http://localhost:3000';

export const chatService = {
  async sendMessage(message: string, context: Message[] = []) {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message,
        context: context.map(msg => ({
          role: msg.sender,
          content: msg.content
        }))
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('API Error:', error.message);
      } else {
        console.error('API Error: Unknown error occurred');
      }
      throw error;
    }
  },

  async getResources() {
    try {
      const response = await axios.get(`${API_BASE_URL}/resources`);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('API Error:', error.message);
      } else {
        console.error('API Error: Unknown error occurred');
      }
      throw error;
    }
  }
};