import { PortfolioLogItem } from '@zachweinberg/obsidian-schema';
import { createDocument, findDocuments } from './db';

export const trackPortfolioLogItem = async (portfolioID: string, description: string) => {
  return createDocument(`portfolios/${portfolioID}/logs`, { portfolioID, description, createdAt: Date.now() });
};

export const getPortfolioLogItems = async (portfolioID: string) => {
  const logItems = await findDocuments<PortfolioLogItem>(
    `portfolios/${portfolioID}/logs`,
    [],
    { property: 'createdAt', direction: 'desc' },
    400
  );
  return logItems;
};
