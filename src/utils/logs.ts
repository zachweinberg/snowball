import { PortfolioLogItem } from '@zachweinberg/obsidian-schema';
import { createDocument, findDocuments } from './db';

export const trackPortfolioLogItem = async (portfolioID: string, description: string) => {
  return createDocument('portfolio-logs', { portfolioID, description });
};

export const getPortfolioLogItems = async (portfolioID: string) => {
  const logItems = await findDocuments<PortfolioLogItem>('portfolio-logs', [
    { property: 'portfolioID', condition: '==', value: portfolioID },
  ]);
  return logItems;
};
