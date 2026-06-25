import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseModel, ResponseDocument } from './schemas/response.schema';

@Injectable()
export class ResponsesService {
  constructor(
    @InjectModel(ResponseModel.name) private responseModel: Model<ResponseDocument>,
  ) {}

  async create(formId: string, answers: Record<string, any>) {
    return this.responseModel.create({ formId, answers });
  }

  async findByForm(formId: string) {
    return this.responseModel.find({ formId }).sort({ createdAt: -1 });
  }

  async countByForm(formId: string) {
    return this.responseModel.countDocuments({ formId });
  }
}