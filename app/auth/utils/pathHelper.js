// src/utils/apiHelper.js

// Helper function to get the full URL with a specific PHP file
export const getPhpFilePath = (filename) => {
  const BASE_URL = 'https://rancho-agripino.com/database/potteryFiles/';
  return `${BASE_URL}/${filename}`;
};
