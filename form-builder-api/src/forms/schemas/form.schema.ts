import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FormDocument = FormModel & Document;

@Schema({ timestamps: true })
export class FormModel {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ type: [Object], default: [] })
  fields: Record<string, any>[];

  @Prop()
  userId: string;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: '' })
  shareToken: string;

  @Prop({ default: false })
  published: boolean;
}

export const FormSchema = SchemaFactory.createForClass(FormModel);