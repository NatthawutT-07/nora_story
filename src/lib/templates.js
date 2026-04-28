import { lazy } from 'react';

/**
 * Central Template Registry
 * All templates should be registered here for use in App and StoryPage.
 * We use lazy loading to keep the initial bundle size small.
 */
export const TEMPLATE_COMPONENTS = {
    // Tier 1
    't1-1': lazy(() => import('../components/templates/tier1/Tier1Template1')),
    't1-2': lazy(() => import('../components/templates/tier1/Tier1Template2')),
    't1-3': lazy(() => import('../components/templates/tier1/Tier1Template3')),
    // 't1-4': lazy(() => import('../components/templates/tier1/Tire1Template4')), // Fix typo later if needed

    // Tier 2
    't2-1': lazy(() => import('../components/templates/tier2/Tier2Template1')),
    't2-2': lazy(() => import('../components/templates/tier2/Tier2Template2')),
    't2-3': lazy(() => import('../components/templates/tier2/Tier2Template3')),

    // Tier 3
    't3-1': lazy(() => import('../components/templates/tier3/Tier3Template1')),
    't3-2': lazy(() => import('../components/templates/tier3/Tier3Template2')),
    't3-3': lazy(() => import('../components/templates/tier3/Tier3Template3')),
};

/**
 * Get a template component by its ID
 * @param {string} id - Template ID (e.g., 't1-1')
 * @returns {React.LazyExoticComponent|null}
 */
export const getTemplateComponent = (id) => {
    return TEMPLATE_COMPONENTS[id] || null;
};
