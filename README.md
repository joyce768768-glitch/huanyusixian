# 寰宇思贤 · 全栈电商双端系统

B 端运营后台 + C 端商城的完整电商系统，探索 **Ontology（本体层）驱动的商品语义组织**：商品、类目、运营数据不再是无结构的表，而是可被 Agent 查询与推理的知识图谱。

## 双端架构

```mermaid
flowchart LR
    subgraph C端 · client
        H[首页] --> P[商品详情] --> O[下单转化]
    end
    subgraph B端 · admin
        D[数据看板] --> G[商品管理] --> O2[订单管理]
    end
    C --> SRV[Server · API]
    B --> SRV
    SRV --> ONT[(Ontology 知识图谱)]
    SRV --> DB[(业务数据)]
```

- **B 端**：运营数据看板、商品/订单管理，面向运营决策的信息架构
- **C 端**：商品浏览 → 详情 → 下单全流程
- **Ontology 层**：AI 产品五层架构（模型→数据→本体→编排→语义）中的本体层实验——为 Agent 检索与推理提供结构化语义

## 技术栈

`TypeScript` `Node/Express` `Web 前端双端`

## 项目定位

独立完成的完整交付项目：从信息架构、双端 UX 设计到工程实现全链路，验证「设计 + 工程」双能力闭环。
