export const LIFE_CHOICE_TEMPLATES = {
  CAREER_GROWTH: {
    id: 'career-growth',
    title: '职业成长',
    title_en: 'Career Growth',
    icon: '🚀',
    prompts: [
      "我应该如何规划未来5年的职业发展路径？",
      "当前行业趋势下，哪些技能最值得投资学习？",
      "如何平衡工作稳定性和职业发展机会？",
      "面对职业瓶颈，我应该选择转型还是深耕？"
    ],
    prompts_en: [
      "How should I plan my career development path for the next 5 years?",
      "Which skills are most worth investing in given current industry trends?",
      "How to balance job stability and career development opportunities?",
      "When facing career bottlenecks, should I choose transformation or deepening?"
    ]
  },
  ENTREPRENEURSHIP: {
    id: 'entrepreneurship', 
    title: '创业选择',
    title_en: 'Entrepreneurship',
    icon: '💼',
    prompts: [
      "创业前需要做好哪些准备工作？",
      "如何评估一个创业想法的市场潜力？",
      "创业初期最常见的风险有哪些？",
      "应该选择合伙创业还是独立创业？"
    ],
    prompts_en: [
      "What preparations should I make before starting a business?",
      "How to evaluate the market potential of a business idea?",
      "What are the most common risks in the early stages of entrepreneurship?",
      "Should I choose partnership entrepreneurship or independent entrepreneurship?"
    ]
  },
  LOCATION_CHOICE: {
    id: 'location-choice',
    title: '地域选择',
    title_en: 'Location Choice',
    icon: '🌍',
    prompts: [
      "选择城市时应该考虑哪些关键因素？",
      "一线城市和二三线城市的利弊分析",
      "如何评估一个地区的发展潜力和生活质量？",
      "异地发展需要考虑哪些实际问题和应对策略？"
    ],
    prompts_en: [
      "What key factors should I consider when choosing a city?",
      "Analysis of pros and cons between tier-1 cities and tier-2/3 cities",
      "How to evaluate a region's development potential and quality of life?",
      "What practical issues and coping strategies should I consider for relocation?"
    ]
  },
  REAL_ESTATE: {
    id: 'real-estate',
    title: '房产投资',
    title_en: 'Real Estate',
    icon: '🏠',
    prompts: [
      "当前是否是买房的好时机？如何判断？",
      "自住房和投资房的选择策略有什么不同？",
      "房贷利率和还款方式应该如何选择？",
      "房产投资需要注意哪些隐藏成本和风险？"
    ],
    prompts_en: [
      "Is now a good time to buy a house? How to judge?",
      "What are the different strategies for choosing owner-occupied vs investment properties?",
      "How should I choose mortgage rates and repayment methods?",
      "What hidden costs and risks should I be aware of in real estate investment?"
    ]
  },
  MARRIAGE: {
    id: 'marriage',
    title: '婚姻选择',
    title_en: 'Marriage Choice',
    icon: '💍',
    prompts: [
      "如何判断是否准备好进入婚姻？",
      "选择伴侣时应该重点关注哪些品质？",
      "婚前需要讨论哪些重要话题？",
      "如何平衡个人发展和婚姻关系？"
    ],
    prompts_en: [
      "How to determine if I'm ready for marriage?",
      "What qualities should I focus on when choosing a partner?",
      "What important topics should be discussed before marriage?",
      "How to balance personal development and marital relationship?"
    ]
  },
  HEALTH: {
    id: 'health',
    title: '健康选择',
    title_en: 'Health Choices',
    icon: '❤️',
    prompts: [
      "如何制定可持续的健康管理计划？",
      "工作压力大时如何保持身心健康？",
      "预防性健康投资有哪些值得推荐？",
      "如何选择适合自己的运动和饮食方式？"
    ],
    prompts_en: [
      "How to create a sustainable health management plan?",
      "How to maintain physical and mental health under work pressure?",
      "What preventive health investments are worth recommending?",
      "How to choose suitable exercise and diet methods?"
    ]
  },
  EDUCATION: {
    id: 'education',
    title: '教育投资',
    title_en: 'Education Investment',
    icon: '🎓',
    prompts: [
      "继续深造和直接工作哪个更值得投资？",
      "如何选择最有价值的培训和学习课程？",
      "在线教育和传统教育的利弊比较",
      "教育投资回报率应该如何评估？"
    ],
    prompts_en: [
      "Which is more worth investing in: further education or direct work?",
      "How to choose the most valuable training and learning courses?",
      "Comparison of pros and cons between online education and traditional education",
      "How should the return on investment in education be evaluated?"
    ]
  },
  RELATIONSHIP: {
    id: 'relationship',
    title: '恋爱选择',
    title_en: 'Relationship Choices',
    icon: '💕',
    prompts: [
      "如何识别健康和不健康的恋爱关系？",
      "价值观差异在恋爱中有多重要？",
      "远距离恋爱需要注意哪些问题？",
      "什么时候应该结束一段关系？"
    ],
    prompts_en: [
      "How to identify healthy and unhealthy romantic relationships?",
      "How important are value differences in relationships?",
      "What issues should be considered in long-distance relationships?",
      "When should I end a relationship?"
    ]
  },
  FINANCE: {
    id: 'finance',
    title: '理财选择',
    title_en: 'Financial Choices',
    icon: '💰',
    prompts: [
      "如何制定个人财务规划和预算？",
      "不同风险等级的理财产品如何配置？",
      "应急基金应该准备多少比较合适？",
      "长期投资和短期投机应该如何选择？"
    ],
    prompts_en: [
      "How to create personal financial planning and budget?",
      "How to allocate financial products with different risk levels?",
      "How much emergency fund should be prepared appropriately?",
      "How to choose between long-term investment and short-term speculation?"
    ]
  },
  RELATIONSHIPS: {
    id: 'relationships',
    title: '人际关系',
    title_en: 'Interpersonal Relationships',
    icon: '👥',
    prompts: [
      "如何建立和维护有价值的人际网络？",
      "职场中如何处理复杂的人际关系？",
      "边界设置在人际关系中有多重要？",
      "如何识别和远离有毒的人际关系？"
    ],
    prompts_en: [
      "How to build and maintain valuable interpersonal networks?",
      "How to handle complex interpersonal relationships in the workplace?",
      "How important are boundary settings in interpersonal relationships?",
      "How to identify and stay away from toxic interpersonal relationships?"
    ]
  },
  TIME_MANAGEMENT: {
    id: 'time-management',
    title: '时间管理',
    title_en: 'Time Management',
    icon: '⏰',
    prompts: [
      "如何平衡工作、学习和个人生活的时间？",
      "有效的时间管理技巧和方法有哪些？",
      "如何避免拖延和提高工作效率？",
      "时间投资和金钱投资哪个更重要？"
    ],
    prompts_en: [
      "How to balance time between work, study and personal life?",
      "What effective time management techniques and methods are available?",
      "How to avoid procrastination and improve work efficiency?",
      "Which is more important: time investment or money investment?"
    ]
  },
  RETIREMENT: {
    id: 'retirement',
    title: '退休规划',
    title_en: 'Retirement Planning',
    icon: '🌅',
    prompts: [
      "什么时候开始规划退休比较合适？",
      "退休需要准备多少资金才足够？",
      "养老保险和其他退休投资如何配置？",
      "退休后如何保持生活质量和意义感？"
    ],
    prompts_en: [
      "When is the right time to start retirement planning?",
      "How much money should be prepared for retirement?",
      "How to allocate pension insurance and other retirement investments?",
      "How to maintain quality of life and sense of meaning after retirement?"
    ]
  },
  CONSUMPTION: {
    id: 'consumption',
    title: '消费决策',
    title_en: 'Consumption Decisions',
    icon: '🛒',
    prompts: [
      "如何区分必要消费和冲动消费？",
      "大额消费决策应该考虑哪些因素？",
      "如何建立健康的消费习惯和价值观？",
      "消费降级和消费升级如何选择？"
    ],
    prompts_en: [
      "How to distinguish between necessary consumption and impulsive consumption?",
      "What factors should be considered in major consumption decisions?",
      "How to establish healthy consumption habits and values?",
      "How to choose between consumption downgrade and consumption upgrade?"
    ]
  },
  CHILD_EDUCATION: {
    id: 'child-education',
    title: '子女教育',
    title_en: 'Child Education',
    icon: '👶',
    prompts: [
      "不同教育理念（中式vs西式）如何选择？",
      "如何平衡学业压力和全面发展？",
      "教育资源有限时应该如何优先配置？",
      "数字化时代如何引导孩子健康使用科技？"
    ],
    prompts_en: [
      "How to choose between different educational philosophies (Chinese vs Western)?",
      "How to balance academic pressure and comprehensive development?",
      "How to prioritize allocation when educational resources are limited?",
      "How to guide children to use technology healthily in the digital age?"
    ]
  }
};