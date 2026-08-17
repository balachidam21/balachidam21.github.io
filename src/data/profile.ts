// Every value here is derived from ~/Documents/career-ops/cv.md.
// Reformulate, never fabricate. No client names — see the Disclosure Policy in
// docs/superpowers/specs/2026-08-12-portfolio-rebuild-design.md

export const profile = {
  name: 'Balaji Chidambaram',
  title: 'Principal Consultant, AI Engineer',
  location: 'San Francisco Bay Area, CA',
  email: 'balaji21.chidambaram@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/balaji-chidam/',
    github: 'https://github.com/balachidam21',
  },

  headline: "Hi, I'm Balaji — I build agentic AI systems.",
  lede:
    'Principal Consultant, AI Engineer at Genpact. I take multi-agent platforms from ' +
    'prototype to production for enterprise teams — and make them auditable once they are there.',

  metrics: [
    { value: '100+', label: 'enterprise users' },
    { value: '400+', label: 'governed KPIs' },
    { value: '40→60%', label: 'user acceptance' },
    { value: '20+', label: 'MCP skills' },
  ],

  experience: [
    {
      company: 'Genpact',
      role: 'Principal Consultant, AI Engineer',
      period: 'Mar 2026 – Present',
      location: 'Remote, USA',
      bullets: [
        'Lead architect for an enterprise Agentic xP&A platform unifying Financial Planning, Supply Chain, Workforce Planning and Demand Planning across 4 business segments. Ran client discovery, set the multi-agent reference architecture, and shipped a production MVP on Databricks in 1 month with a cross-functional team of 3 engineers and 2 SMEs.',
        'Architected a Lakebase-backed agent governance layer where finance users curate 400+ KPIs and drivers directly, with versioned lineage — clone, edit, publish, audit. Cut data-readiness prep from over a month to a few days, with every agent output traceable to a governed source.',
      ],
    },
    {
      company: 'Genpact',
      role: 'Assistant Manager, AI Engineer',
      period: 'May 2024 – Feb 2026',
      location: 'Remote, USA',
      bullets: [
        'Architected a multi-agent Conversational AI platform using a LangGraph orchestrator over 8 deterministic tools for natural-language analysis, reducing analysis lead time from days to minutes for 100+ enterprise users. A master orchestrator routed requests to domain sub-agents via hierarchical delegation, ReAct, and Supervisor patterns.',
        'Exposed 20+ reusable analysis skills through MCP servers with least-privilege tool access and prompt-injection guardrails on every tool call, letting domain and agent teams build in parallel.',
        'Architected a persistence layer for agentic workflows enabling longitudinal, multi-turn analysis across reporting cycles — shifting the product from one-shot Q&A to continuous conversational intelligence.',
        'Systematized agent quality assurance with an MLflow GenAI evaluation harness using LLM-as-a-judge scorers, converting subjective review into regression-tested SLAs — raising user acceptance from 40% to 60% and preempting ~20 pre-production regressions.',
        'Engineered a query-lineage governance layer surfacing underlying SQL and source datasets, moving AI-driven analysis from a black box to a fully auditable enterprise solution.',
      ],
    },
    {
      company: 'Keck Medicine of USC',
      role: 'Data Engineer / Marketing Data Analyst',
      period: 'Sep 2022 – Dec 2024',
      location: 'Los Angeles, CA',
      bullets: [
        'Engineered a multi-source data warehouse and analytics platform on AWS Redshift, unifying analytics across data silos.',
        'Built AWS-based ingestion and ETL pipelines (Lambda, EC2, VPC, RDS) that cut reporting prep time by 40%, and designed a Tableau/AWS/Looker analytics platform that raised campaign visibility by 54% and engagement by 32%.',
      ],
    },
    {
      company: 'Sayari Labs',
      role: 'Data Engineer Intern',
      period: 'May 2023 – Jul 2023',
      location: 'Washington, D.C.',
      bullets: [
        'Built scalable microservice-style data pipelines (Scrapy, Kubernetes, Airflow) ingesting and transforming financial and corporate data from 10+ sources monthly with high availability.',
      ],
    },
    {
      company: 'USC Information Sciences Institute',
      role: 'Research Assistant, Center on Knowledge Graphs',
      period: 'Aug 2022 – May 2023',
      location: 'Los Angeles, CA',
      bullets: [
        'Executed knowledge graph algorithms with the KGTK toolkit, achieving 78% accuracy predicting information flow.',
        'Developed a chatbot using Named Entity Recognition and Relation Extraction with Transformers, converting GitHub READMEs into knowledge graphs and improving query response accuracy by 40%.',
      ],
    },
    {
      company: 'HertzAI',
      role: 'Cloud Architect Intern',
      period: 'Aug 2021 – Nov 2021',
      location: 'Chennai, India',
      bullets: [
        'Automated the CI/CD pipeline with Jenkins across ten cloud services, improving release cycles by 40% and reducing deployment errors by 30%.',
        'Architected and optimized an API Gateway managing traffic surges and halving response times.',
      ],
    },
  ],

  education: [
    {
      degree: 'M.S. Computer Science',
      school: 'University of Southern California',
      period: 'Jan 2022 – Dec 2023',
      detail: 'GPA 3.81 / 4.0',
    },
    {
      degree: 'B.E. Computer Science and Engineering',
      school: 'Anna University, India',
      period: 'Aug 2017 – Jul 2021',
      detail: 'GPA 8.97 / 10',
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
        'Real-time stock market streaming with Kafka, Apache Spark and Cassandra, orchestrated in Airflow. 30% faster processing, 40% lower retrieval time.',
    },
    {
      name: 'KG + Fusion Transformer for Multi-Hop QA',
      href: 'https://github.com/balachidam21/kg-fusion-transformer-for-multi-hop-qa',
      blurb:
        'Fine-tuned RoBERTa to improve embedding quality in Dynamically Fused Graph Networks; replaced skip-connections with Compact Bilinear Pooling and Tucker Fusion for faster convergence.',
    },
    {
      name: 'Adapting Vision-Language Models to Vision-Only Tasks',
      href: 'https://github.com/balachidam21/adapt-VL-models-to-vision-only-tasks',
      blurb:
        'Optimized Vision-Language models for object detection, with Docker and GCP for reproducible training and deployment plus a real-time streaming pipeline.',
    },
  ],

  skills: [
    {
      label: 'Specialties',
      value:
        'Agentic AI & Multi-Agent Systems (ReAct, Hierarchical Delegation, Supervisor), MCP, Agent Skills, Distributed Systems Design, RAG & Vector Databases (pgvector), Agent Governance & Lineage, LLM Evaluation & Observability, Knowledge Graphs, ML Forecasting',
    },
    { label: 'Languages', value: 'Python (PySpark), SQL, C++, C, Java, React' },
    {
      label: 'AI / ML',
      value: 'LangGraph, MCP, Google ADK, TensorFlow, PyTorch, MLflow, TimeGPT, KGTK, Transformers',
    },
    {
      label: 'Platforms & Operations',
      value:
        'AWS (Lambda, EC2, VPC, RDS, Redshift), Databricks, Google Cloud (Vertex AI, Gemini, Document AI), Azure, Kubernetes, Docker, Airflow, Jenkins, Kafka, Cassandra, CI/CD',
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
} as const;
