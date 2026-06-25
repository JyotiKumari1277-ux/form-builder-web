import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResponseDocument = ResponseModel & Document;

@Schema({ timestamps: true })
export class ResponseModel {
  @Prop({ required: true })
  formId: string;

  @Prop({ type: Object })
  answers: Record<string, any>;
}

export const ResponseSchema = SchemaFactory.createForClass(ResponseModel);