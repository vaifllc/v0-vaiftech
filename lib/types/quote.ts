// Quote complexity levels
export enum QuoteComplexity {
  SIMPLE = "simple",
  MODERATE = "moderate",
  COMPLEX = "complex",
  VERY_COMPLEX = "very_complex",
}

// Project types
export enum ProjectType {
  WEBSITE = "website",
  PWA = "pwa",
  WEB_APP = "web_app",
  WEBSITE_BUILDER = "website_builder",
  WEBSITE_REVAMP = "website_revamp",
  MOBILE_APP = "mobile_app",
  IOS_APP = "ios_app",
  ANDROID_APP = "android_app",
  CROSS_PLATFORM_APP = "cross_platform_app",
  ECOMMERCE = "ecommerce",
  CMS = "cms",
  CUSTOM = "custom",
}

// Project categories
export enum ProjectCategory {
  BROCHURE = "brochure",
  ECOMMERCE = "ecommerce",
  MARKETPLACE = "marketplace",
  BLOG = "blog",
  PORTFOLIO = "portfolio",
  SOCIAL_NETWORK = "social_network",
  BOOKING_SYSTEM = "booking_system",
  LEARNING_MANAGEMENT = "learning_management",
  SAAS = "saas",
  OTHER = "other",
  CORPORATE = "corporate",
  LANDING_PAGE = "landing_page",
  MEMBERSHIP = "membership",
  INFORMATIONAL = "informational",
  EDUCATIONAL = "educational",
  E_COMMERCE = "e_commerce",
  SUBSCRIPTION = "subscription",
  DIGITAL_DOWNLOADS = "digital_downloads",
  NATIVE_IOS = "native_ios",
  NATIVE_ANDROID = "native_android",
  CROSS_PLATFORM = "cross_platform",
  MOBILE_GAME = "mobile_game",
  AR_VR = "ar_vr",
  SPA = "spa",
  PROGRESSIVE = "progressive",
  PORTAL = "portal",
  CRM = "crm",
  NEWS_CONTENT = "news_content",
  WEBSITE_REDESIGN = "website_redesign",
  WEBSITE_BUILDER_PLATFORM = "website_builder_platform",
  CUSTOM = "custom",
}

// Payment plan options
export enum PaymentPlanType {
  FULL_PAYMENT = "full_payment",
  TWO_INSTALLMENTS = "two_installments",
  THREE_INSTALLMENTS = "three_installments",
  MILESTONE_BASED = "milestone_based",
  CUSTOM = "custom",
}

// Helper functions to get display names
export const getComplexityName = (complexity: QuoteComplexity): string => {
  const names: Record<QuoteComplexity, string> = {
    [QuoteComplexity.SIMPLE]: "Simple",
    [QuoteComplexity.MODERATE]: "Moderate",
    [QuoteComplexity.COMPLEX]: "Complex",
    [QuoteComplexity.VERY_COMPLEX]: "Very Complex",
  }
  return names[complexity]
}

export const getProjectTypeName = (type: ProjectType): string => {
  const names: Record<ProjectType, string> = {
    [ProjectType.WEBSITE]: "Website",
    [ProjectType.PWA]: "Progressive Web App",
    [ProjectType.WEB_APP]: "Web Application",
    [ProjectType.WEBSITE_BUILDER]: "Website Builder",
    [ProjectType.WEBSITE_REVAMP]: "Website Revamp",
    [ProjectType.MOBILE_APP]: "Mobile App",
    [ProjectType.IOS_APP]: "iOS App",
    [ProjectType.ANDROID_APP]: "Android App",
    [ProjectType.CROSS_PLATFORM_APP]: "Cross-Platform App",
    [ProjectType.ECOMMERCE]: "E-Commerce",
    [ProjectType.CMS]: "Content Management System",
    [ProjectType.CUSTOM]: "Custom Project",
  }
  return names[type]
}

export const getCategoryName = (category: ProjectCategory): string => {
  const names: Record<ProjectCategory, string> = {
    [ProjectCategory.BROCHURE]: "Brochure Website",
    [ProjectCategory.ECOMMERCE]: "E-Commerce",
    [ProjectCategory.MARKETPLACE]: "Marketplace",
    [ProjectCategory.BLOG]: "Blog",
    [ProjectCategory.PORTFOLIO]: "Portfolio",
    [ProjectCategory.SOCIAL_NETWORK]: "Social Network",
    [ProjectCategory.BOOKING_SYSTEM]: "Booking System",
    [ProjectCategory.LEARNING_MANAGEMENT]: "Learning Management System",
    [ProjectCategory.SAAS]: "SaaS Platform",
    [ProjectCategory.OTHER]: "Other",
    [ProjectCategory.CORPORATE]: "Corporate Website",
    [ProjectCategory.LANDING_PAGE]: "Landing Page",
    [ProjectCategory.MEMBERSHIP]: "Membership Site",
    [ProjectCategory.INFORMATIONAL]: "Informational Website",
    [ProjectCategory.EDUCATIONAL]: "Educational Platform",
    [ProjectCategory.E_COMMERCE]: "E-Commerce Store",
    [ProjectCategory.SUBSCRIPTION]: "Subscription Service",
    [ProjectCategory.DIGITAL_DOWNLOADS]: "Digital Downloads",
    [ProjectCategory.NATIVE_IOS]: "Native iOS App",
    [ProjectCategory.NATIVE_ANDROID]: "Native Android App",
    [ProjectCategory.CROSS_PLATFORM]: "Cross-Platform App",
    [ProjectCategory.MOBILE_GAME]: "Mobile Game",
    [ProjectCategory.AR_VR]: "AR/VR Application",
    [ProjectCategory.SPA]: "Single Page Application",
    [ProjectCategory.PROGRESSIVE]: "Progressive Web App",
    [ProjectCategory.PORTAL]: "Web Portal",
    [ProjectCategory.CRM]: "CRM System",
    [ProjectCategory.CMS]: "Content Management System",
    [ProjectCategory.NEWS_CONTENT]: "News/Content Website",
    [ProjectCategory.WEBSITE_REDESIGN]: "Website Redesign",
    [ProjectCategory.WEBSITE_BUILDER_PLATFORM]: "Website Builder Platform",
    [ProjectCategory.CUSTOM]: "Custom Project",
  }
  return names[category]
}

export const getPaymentPlanName = (plan: PaymentPlanType): string => {
  const names: Record<PaymentPlanType, string> = {
    [PaymentPlanType.FULL_PAYMENT]: "Full Payment",
    [PaymentPlanType.TWO_INSTALLMENTS]: "Two Installments",
    [PaymentPlanType.THREE_INSTALLMENTS]: "Three Installments",
    [PaymentPlanType.MILESTONE_BASED]: "Milestone Based",
    [PaymentPlanType.CUSTOM]: "Custom Payment Plan",
  }
  return names[plan]
}

// Base pricing for different project types
export const getBasePrice = (type: ProjectType, complexity: QuoteComplexity): number => {
  const basePrices: Record<ProjectType, Record<QuoteComplexity, number>> = {
    [ProjectType.WEBSITE]: {
      [QuoteComplexity.SIMPLE]: 2500,
      [QuoteComplexity.MODERATE]: 5000,
      [QuoteComplexity.COMPLEX]: 10000,
      [QuoteComplexity.VERY_COMPLEX]: 20000,
    },
    [ProjectType.PWA]: {
      [QuoteComplexity.SIMPLE]: 5000,
      [QuoteComplexity.MODERATE]: 10000,
      [QuoteComplexity.COMPLEX]: 20000,
      [QuoteComplexity.VERY_COMPLEX]: 35000,
    },
    [ProjectType.WEB_APP]: {
      [QuoteComplexity.SIMPLE]: 7500,
      [QuoteComplexity.MODERATE]: 15000,
      [QuoteComplexity.COMPLEX]: 30000,
      [QuoteComplexity.VERY_COMPLEX]: 50000,
    },
    [ProjectType.WEBSITE_BUILDER]: {
      [QuoteComplexity.SIMPLE]: 10000,
      [QuoteComplexity.MODERATE]: 20000,
      [QuoteComplexity.COMPLEX]: 40000,
      [QuoteComplexity.VERY_COMPLEX]: 75000,
    },
    [ProjectType.WEBSITE_REVAMP]: {
      [QuoteComplexity.SIMPLE]: 2000,
      [QuoteComplexity.MODERATE]: 4000,
      [QuoteComplexity.COMPLEX]: 8000,
      [QuoteComplexity.VERY_COMPLEX]: 15000,
    },
    [ProjectType.MOBILE_APP]: {
      [QuoteComplexity.SIMPLE]: 10000,
      [QuoteComplexity.MODERATE]: 20000,
      [QuoteComplexity.COMPLEX]: 40000,
      [QuoteComplexity.VERY_COMPLEX]: 75000,
    },
    [ProjectType.IOS_APP]: {
      [QuoteComplexity.SIMPLE]: 8000,
      [QuoteComplexity.MODERATE]: 15000,
      [QuoteComplexity.COMPLEX]: 30000,
      [QuoteComplexity.VERY_COMPLEX]: 60000,
    },
    [ProjectType.ANDROID_APP]: {
      [QuoteComplexity.SIMPLE]: 8000,
      [QuoteComplexity.MODERATE]: 15000,
      [QuoteComplexity.COMPLEX]: 30000,
      [QuoteComplexity.VERY_COMPLEX]: 60000,
    },
    [ProjectType.CROSS_PLATFORM_APP]: {
      [QuoteComplexity.SIMPLE]: 12000,
      [QuoteComplexity.MODERATE]: 25000,
      [QuoteComplexity.COMPLEX]: 50000,
      [QuoteComplexity.VERY_COMPLEX]: 90000,
    },
    [ProjectType.ECOMMERCE]: {
      [QuoteComplexity.SIMPLE]: 5000,
      [QuoteComplexity.MODERATE]: 10000,
      [QuoteComplexity.COMPLEX]: 25000,
      [QuoteComplexity.VERY_COMPLEX]: 50000,
    },
    [ProjectType.CMS]: {
      [QuoteComplexity.SIMPLE]: 4000,
      [QuoteComplexity.MODERATE]: 8000,
      [QuoteComplexity.COMPLEX]: 15000,
      [QuoteComplexity.VERY_COMPLEX]: 30000,
    },
    [ProjectType.CUSTOM]: {
      [QuoteComplexity.SIMPLE]: 10000,
      [QuoteComplexity.MODERATE]: 20000,
      [QuoteComplexity.COMPLEX]: 40000,
      [QuoteComplexity.VERY_COMPLEX]: 80000,
    },
  }

  return basePrices[type][complexity]
}
