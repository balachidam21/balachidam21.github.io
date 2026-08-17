// Facts derive from ~/Documents/career-ops/cv.md, expanded with engagement-level detail
// from the user's own master résumé (Google Doc, 2026-06-30) at their explicit direction.
// Both are the user's authored sources. Reformulate freely; never add a claim neither
// source makes, and never characterise a client — not even by industry. Describing an
// engagement as "for a healthcare distributor" is the anonymisation pattern the
// Disclosure Policy rejects: it narrows identification while advertising the omission.
//
// CLIENT NAMES ARE DELIBERATELY OMITTED. The source documents name Cardinal Health,
// HESS, Finance One, Fin.AI and Contract CoPilot; the site describes those engagements
// without naming them. See the Disclosure Policy in
// docs/superpowers/specs/2026-08-12-portfolio-rebuild-design.md
//
// `summary` bullets drive the homepage (short). `engagements` drive /about (detailed).

export interface Engagement {
  name: string;
  period: string;
  bullets: string[];
}

export interface Role {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string[];
  engagements?: Engagement[];
  /** Include this role in the one-page PDF. Declared here rather than filtered by
   *  company name in resume.astro, where adding a new employer would silently omit it
   *  from the résumé with no error and green CI. */
  resume?: boolean;
}

export const profile = {
  name: 'Balaji Chidambaram',
  title: 'Principal Consultant, AI Engineer',
  location: 'San Francisco Bay Area, CA',
  email: 'balaji21.chidambaram@gmail.com',
  phone: '(669) 263-5630',
  links: {
    linkedin: 'https://www.linkedin.com/in/balaji-chidam/',
    github: 'https://github.com/balachidam21',
  },

  headline: "Hi, I'm Balaji — I build agentic AI systems.",
  lede:
    'Principal Consultant, AI Engineer at Genpact. I take multi-agent platforms from ' +
    'prototype to production for enterprise teams — and make them auditable once they are there.',

  // Compressed one-liner for the one-page PDF; `about` is the fuller web version.
  resumeSummary:
    'Software engineer building and operating production agentic and GenAI systems — multi-agent ' +
    'orchestration and RAG at enterprise scale on AWS, Databricks and Google Cloud, with the ' +
    'policy-scoped tool access, audit lineage and automated evaluation that keep them trustworthy. ' +
    'MS in Computer Science, USC.',

  about:
    'I build and operate production agentic and GenAI systems, owning features end to end — ' +
    'design, implementation, testing, deployment and operations — across distributed services on ' +
    'AWS, Databricks and Google Cloud. Most of my work is multi-agent orchestration and RAG at ' +
    'enterprise scale, plus the unglamorous parts that decide whether any of it survives contact ' +
    'with a real organisation: policy-scoped tool access, audit lineage, and automated agent evaluation.',

  experience: [
    {
      company: 'Genpact',
      resume: true,
      role: 'Principal Consultant, AI Engineer',
      period: 'Mar 2026 – Present',
      location: 'Remote, USA',
      summary: [
        'Lead architect for an enterprise Agentic xP&A platform unifying Financial Planning, Supply Chain, Workforce Planning and Demand Planning across 4 business segments. Ran client discovery, set the multi-agent reference architecture, and shipped a production MVP on Databricks in 1 month with a cross-functional team of 3 engineers and 2 SMEs.',
        'Architected a Lakebase-backed agent governance layer where finance users curate 400+ KPIs and drivers directly, with versioned lineage — clone, edit, publish, audit. Cut data-readiness prep from over a month to a few days, with every agent output traceable to a governed source.',
      ],
      engagements: [
        {
          name: 'Enterprise Agentic xP&A platform',
          period: 'Mar 2026 – Present',
          bullets: [
            'Lead architect for a platform unifying Financial Planning, Supply Chain, Workforce Planning and Demand Planning across 4 business segments.',
            'Ran client discovery, set the multi-agent reference architecture, and delivered a production MVP on Databricks in 1 month with a cross-functional team of 3 engineers and 2 SMEs.',
            'Resolved the engineering bottleneck around driver management by letting finance users curate KPI drivers directly through a custom application, replacing hardcoded driver registries.',
            'Architected a Lakebase-backed governance layer with versioned lineage — clone, edit, publish, audit — covering 400+ KPIs and drivers. Replaced Excel and hardcoded driver registries, cut data-readiness prep from over a month to a few days, and made agent dependency management explicit.',
          ],
        },
      ],
    },
    {
      company: 'Genpact',
      resume: true,
      role: 'Assistant Manager, AI Engineer',
      period: 'May 2024 – Feb 2026',
      location: 'Remote, USA',
      summary: [
        'Architected a multi-agent Conversational AI platform using a LangGraph orchestrator over 8 deterministic tools, reducing analysis lead time from days to minutes for 100+ enterprise users.',
        'Exposed 20+ reusable analysis skills through MCP servers with least-privilege tool access and prompt-injection guardrails on every tool call.',
        'Systematized agent quality assurance with an MLflow GenAI evaluation harness using LLM-as-a-judge scorers — raising user acceptance from 40% to 60% and preempting ~20 pre-production regressions.',
        'Engineered a query-lineage governance layer surfacing underlying SQL and source datasets, moving AI-driven analysis from a black box to an auditable solution.',
      ],
      engagements: [
        {
          name: 'Multi-agent conversational AI for enterprise finance',
          period: 'Jul 2025 – Feb 2026',
          bullets: [
            'Architected a multi-agent Conversational AI platform integrated with Power BI, using a LangGraph orchestrator over 8 deterministic tools for natural-language analysis of Revenue, Cash Flow and P&L — reducing analysis lead time from days to minutes for 100+ enterprise users.',
            'Designed a master orchestrator that routes requests to domain sub-agents via hierarchical delegation, ReAct and Supervisor patterns.',
            'Exposed 20+ reusable analysis skills through MCP servers with least-privilege tool access and prompt-injection guardrails on every tool call, letting domain and agent teams build in parallel.',
            'Architected a persistence layer for agentic workflows enabling longitudinal, multi-turn analysis across reporting cycles — state management and session continuity shifted the product from one-shot Q&A to continuous conversational intelligence.',
            'Systematized agent quality assurance with an MLflow GenAI evaluation harness using LLM-as-a-judge scorers, converting subjective review into regression-tested SLAs — raising user acceptance from 40% to 60% and preempting ~20 pre-production regressions.',
            'Engineered a query-lineage governance layer surfacing the underlying SQL and source datasets, with one-click rerun in Power BI and SQL — moving AI-driven analysis from a black box to a fully auditable enterprise solution.',
          ],
        },
        {
          name: 'Multi-agent financial assistant on Databricks',
          period: 'Apr 2025 – Jun 2025',
          bullets: [
            'Built a multi-agent financial assistant on Databricks using LangGraph and Genie AI/BI, enabling financial insight and analysis through natural-language queries, with a Streamlit front end deployed on Databricks Apps.',
            'Developed scenario-based forecasting with TimeGPT using exogenous drivers, achieving 18% improved forecast accuracy.',
          ],
        },
        {
          name: 'Credit memo automation',
          period: 'Nov 2024 – Mar 2025',
          bullets: [
            'Architected an end-to-end GenAI pipeline on GCP and Salesforce handling highly diverse document formats across 100+ companies, replacing manual workflows with intelligent extraction to process 2,000+ memos monthly with high precision.',
          ],
        },
        {
          name: 'Document extraction MVP',
          period: 'Nov 2024 – Dec 2024',
          bullets: [
            'Built and deployed a document extraction parser with Document AI and Gemini LLMs, converting unstructured documents into structured formats for downstream retrieval.',
          ],
        },
        {
          name: 'Contract analysis RAG system',
          period: 'May 2024 – Oct 2024',
          bullets: [
            'Built core parts of a GenAI and Knowledge-Graph-backed RAG system indexing contracts in pgvector with a re-ranking retriever, supporting Q&A, favorability assessment, deviation analysis and automated summarization — cutting legal review from weeks to minutes.',
            'Implemented the secure end-to-end application on GCP with Gemini LLMs, using private networking and secure infrastructure practices appropriate for sensitive legal documents.',
          ],
        },
      ],
    },
    {
      company: 'Keck Medicine of USC',
      resume: true,
      role: 'Data Engineer (Contract)',
      period: 'Feb 2024 – Dec 2024',
      location: 'Los Angeles, CA',
      summary: [
        'Engineered a multi-source data warehouse and analytics platform on AWS Redshift, integrating Salesforce Data Cloud, Google Analytics and CRM to unify analytics across data silos.',
        'Engineered customer segments and activations in Salesforce Data Cloud using tailored AWS pipelines (Lambda, RDS), driving a 30% increase in operational efficiency.',
      ],
    },
    {
      company: 'Keck Medicine of USC',
      resume: true,
      role: 'Marketing Data Analyst',
      period: 'Sep 2022 – Dec 2023',
      location: 'Los Angeles, CA',
      summary: [
        'Built AWS-based ingestion and ETL transformation pipelines (Lambda, EC2, VPC, RDS) that cut reporting prep time by 40%. Revamped data architecture with Adverity to align financial and marketing data, improving ROI-validation accuracy by 20%.',
        'Designed a Tableau/AWS/Looker analytics platform on the data lake, raising campaign visibility by 54% and engagement by 32%.',
      ],
    },
    {
      company: 'Sayari Labs',
      resume: true,
      role: 'Data Engineer Intern',
      period: 'May 2023 – Jul 2023',
      location: 'Washington, D.C.',
      summary: [
        'Built scalable microservice-style data pipelines (Scrapy, Kubernetes, Airflow) ingesting and transforming financial and corporate data from 10+ sources monthly with high availability.',
        'Standardized Spark data modeling and developed end-to-end pipeline frameworks with component-level unit tests, CI/CD integration and documentation, enabling agile cross-functional delivery.',
      ],
    },
    {
      company: 'USC Information Sciences Institute',
      role: 'Research Assistant, Center on Knowledge Graphs',
      period: 'Aug 2022 – May 2023',
      location: 'Los Angeles, CA',
      summary: [
        'Executed knowledge graph algorithms with the KGTK toolkit, achieving 78% accuracy predicting information flow.',
        'Developed a chatbot using Named Entity Recognition and Relation Extraction with Transformers, converting GitHub READMEs into knowledge graphs and improving query response accuracy by 40%.',
      ],
    },
    {
      company: 'HertzAI',
      role: 'Cloud Architect Intern',
      period: 'Aug 2021 – Nov 2021',
      location: 'Chennai, India',
      summary: [
        'Automated the CI/CD pipeline with Jenkins across ten cloud services, improving release cycles by 40% and reducing deployment errors by 30%.',
        'Architected and optimized an API Gateway managing traffic surges and halving response times.',
      ],
    },
  ] satisfies Role[],

  education: [
    {
      degree: 'M.S. Computer Science',
      school: 'University of Southern California',
      period: 'Jan 2022 – Dec 2023',
      detail: 'Los Angeles, CA · GPA 3.81 / 4.0',
    },
    {
      degree: 'B.E. Computer Science and Engineering',
      school: 'Anna University',
      period: 'Aug 2017 – Jul 2021',
      detail: 'India · GPA 8.97 / 10',
    },
  ],

  publication: {
    authors: 'P. Shekhar, R. Saha, M. J. B. Dudekula, B. Chidambaram',
    title:
      'Effectiveness of Retrieval Augmented Generation, Contextualized Examples and Prompt Finetuning on Data Enrichment, Cleaning and Master Data Creation',
    venue: 'IEEE ACDSA, 2026',
    doi: 'https://doi.org/10.1109/ACDSA67686.2026.11467982',
  },

  projects: [
    {
      name: 'Automated Stock Market Streaming',
      href: 'https://github.com/balachidam21/automated-stock-market-streaming',
      blurb:
        'A real-time stock market streaming system with workflow automation in Apache Airflow, built on Kafka, Apache Spark and Cassandra. Improved processing speed by 30% and reduced retrieval time by 40%.',
    },
    {
      name: 'KG + Fusion Transformer for Multi-Hop QA',
      href: 'https://github.com/balachidam21/kg-fusion-transformer-for-multi-hop-qa',
      blurb:
        'Fine-tuned RoBERTa to improve embedding quality and accuracy in Dynamically Fused Graph Networks, replacing skip-connections with Compact Bilinear Pooling and Tucker Fusion for faster convergence.',
    },
    {
      name: 'Adapting Vision-Language Models to Vision-Only Tasks',
      href: 'https://github.com/balachidam21/adapt-VL-models-to-vision-only-tasks',
      blurb:
        'Optimized Vision-Language models for vision-centric tasks, notably object detection, with Docker and GCP for reproducible training and deployment plus a real-time streaming pipeline for immediate inference.',
    },
  ],

  // Grouped for chip rendering on /about. Every item traces to cv.md — either its
  // Skills section or an experience bullet (Power BI, Streamlit, Genie AI/BI, Tableau,
  // Looker, Adverity, Scrapy, Lakebase, LLM-as-a-judge and prompt-injection guardrails
  // all appear in the experience text but were missing from the CV's own skills line).
  skills: [
    {
      label: 'Agentic AI & LLM systems',
      resumeCount: 8,
      items: [
        'Multi-agent systems',
        'ReAct',
        'Hierarchical delegation',
        'Supervisor pattern',
        'MCP',
        'Agent Skills',
        'RAG',
        'Vector databases (pgvector)',
        'Agent governance & lineage',
        'LLM evaluation & observability',
        'LLM-as-a-judge',
        'Prompt-injection guardrails',
        'Least-privilege tool access',
      ],
    },
    {
      label: 'Languages',
      resumeCount: 7,
      items: ['Python', 'PySpark', 'SQL', 'C++', 'C', 'Java', 'React'],
    },
    {
      label: 'AI / ML frameworks',
      resumeCount: 8,
      items: [
        'LangGraph',
        'MCP servers',
        'Google ADK',
        'TensorFlow',
        'PyTorch',
        'MLflow',
        'TimeGPT',
        'Transformers',
        'KGTK',
        'Document AI',
        'Gemini',
        'Genie AI/BI',
      ],
    },
    {
      label: 'Data & streaming',
      resumeCount: 7,
      items: [
        'Apache Spark',
        'Kafka',
        'Cassandra',
        'Airflow',
        'Redshift',
        'Salesforce Data Cloud',
        'Scrapy',
        'Adverity',
        'Knowledge graphs',
        'ML forecasting',
      ],
    },
    {
      label: 'Cloud & platform',
      resumeCount: 6,
      items: [
        'AWS (Lambda, EC2, VPC, RDS, Redshift)',
        'Google Cloud (Vertex AI)',
        'Databricks',
        'Databricks Apps',
        'Lakebase',
        'Azure',
        'Kubernetes',
        'Docker',
        'Jenkins',
        'CI/CD',
      ],
    },
    {
      label: 'Analytics & interfaces',
      resumeCount: 4,
      items: ['Power BI', 'Tableau', 'Looker', 'Streamlit'],
    },
    {
      label: 'Engineering',
      resumeCount: 0,
      items: ['Distributed systems design', 'Object-oriented design', 'Data warehousing', 'ETL pipeline design'],
    },
  ],

  certifications: [
    {
      name: 'Google Cloud Professional Machine Learning Engineer',
      href: 'https://www.credly.com/badges/97c6f50c-1bef-436e-bcb1-f1154239d518/public_url',
    },
    {
      name: 'Databricks Generative AI Associate',
      href: 'https://credentials.databricks.com/cfc819fc-1713-4ea5-ac62-87c21e7bc3d6',
    },
    {
      name: 'Google Cloud Associate Cloud Engineer',
      href: 'https://www.credly.com/badges/933c2caa-b186-4a6e-9c4d-b86543fed717/public_url',
    },
  ],
};
