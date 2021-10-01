import * as Joi from '@hapi/joi'

export const configValidationSchema = Joi.object({
  STAGE: Joi.string().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().default(5432).required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  AWS_STORAGE_BUCKET_NAME: Joi.string().required(),
  AWS_BUCKET_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  JWT_SECRET: Joi.string().required()
})
