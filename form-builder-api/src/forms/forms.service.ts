import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FormModel, FormDocument } from './schemas/form.schema';

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(FormModel.name) private formModel: Model<FormDocument>,
  ) {}

  async create(userId: string, title: string) {
    return this.formModel.create({ userId, title });
  }

  async findAll(userId: string) {
    return this.formModel.find({ userId }).sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const form = await this.formModel.findById(id);
    if (!form) throw new NotFoundException('Form not found');
    return form;
  }

  async update(id: string, userId: string, data: any) {
    return this.formModel.findOneAndUpdate(
      { _id: id, userId },
      data,
      { new: true },
    );
  }

  async remove(id: string, userId: string) {
    return this.formModel.findOneAndDelete({ _id: id, userId });
  }

  async findByToken(token: string) {
    return this.formModel.findOne({ shareToken: token, published: true });
  }
}