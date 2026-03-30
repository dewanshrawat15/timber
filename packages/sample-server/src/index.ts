import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import detailsRouter from './routes/details';

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// Swagger / OpenAPI setup
// ---------------------------------------------------------------------------
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Timber Sample Server',
      version: '1.0.0',
      description:
        'Sample server that returns Timber JSON schemas consumed by TimberRenderer. ' +
        'Call GET /api/details?screen=<screenType> to fetch a layout.',
    },
    components: {
      schemas: {
        TimberStyle: {
          type: 'object',
          properties: {
            className: { type: 'string', description: 'Tailwind utility classes' },
            style: {
              type: 'object',
              description: 'Inline React CSSProperties for dynamic values',
              additionalProperties: true,
            },
          },
        },
        TimberNode: {
          type: 'object',
          required: ['type'],
          properties: {
            type: {
              type: 'string',
              enum: ['Row', 'Column', 'Grid', 'Image', 'Card', 'Text', 'Button', 'Modal', 'BottomSheet'],
              description: 'The Timber component type to render',
            },
            key: { type: 'string', description: 'Stable React key' },
            props: {
              type: 'object',
              description: 'Component-specific props',
              additionalProperties: true,
            },
            styling: { $ref: '#/components/schemas/TimberStyle' },
            data: {
              type: 'object',
              description: 'Server-driven data payload',
              additionalProperties: true,
            },
            children: {
              oneOf: [
                { type: 'string', description: 'Leaf text content' },
                {
                  type: 'array',
                  items: { $ref: '#/components/schemas/TimberNode' },
                  description: 'Nested child nodes',
                },
              ],
            },
          },
        },
        TimberSchema: {
          type: 'object',
          required: ['version', 'root'],
          properties: {
            version: { type: 'string', example: '1.0' },
            name: { type: 'string', example: 'Dashboard' },
            navId: { type: 'string', nullable: true, description: 'Echoed navId from query param' },
            root: { $ref: '#/components/schemas/TimberNode' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            validScreens: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
});

// swagger-ui-express v5 types are incompatible with Express 4 overloads — cast required
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(app as any).use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/openapi.json', (_req, res) => res.json(swaggerSpec));

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use('/api/details', detailsRouter);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
const PORT = process.env['PORT'] ?? 3001;
app.listen(PORT, () => {
  console.log(`\nTimber sample server running`);
  console.log(`  API:     http://localhost:${PORT}/api/details?screen=dashboard`);
  console.log(`  Swagger: http://localhost:${PORT}/docs\n`);
});
