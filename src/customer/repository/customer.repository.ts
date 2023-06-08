import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  ConflictException,
  Inject,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { LOGGER } from './../../common/core.module';
import { Customer } from '../entity/customer.entity';
import { CustomerDto } from '../dto/customer.dto';

export class CustomerRepository {
  constructor(
    @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {}

  async createCustomerDetails(createCustomerDto: CustomerDto) {
    let customer = await this.getCustomerDetailsById(
      createCustomerDto.customerId,
    );
    if (customer) {
      throw new ConflictException('Customer Detials already exist.');
    }
    customer = new this.customerModel({ ...createCustomerDto });

    try {
      customer = await customer.save({});
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!customer) {
      throw new ConflictException('Customer not created.');
    }

    return customer;
  }

  async getCustomerDetailsById(id: string) {
    let customerDetails;
    try {
      customerDetails = await this.customerModel
        .findOne({ $and: [{ isActive: true }, { customerId: id }] })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return customerDetails;
  }

  async getCustomerDetails() {
    let customerDetails;
    try {
      customerDetails = await this.customerModel
        .find({ $and: [{ isActive: true }] })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return customerDetails;
  }

  async updateCustomerDetails(createCustomerDto: CustomerDto) {
    let customerDetails;
    try {
      customerDetails = await this.customerModel
        .findOneAndUpdate(
          {
            $and: [
              { isActive: true },
              { customerId: createCustomerDto.customerId },
            ],
          },
          createCustomerDto,
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!customerDetails) {
      throw new InternalServerErrorException('Customer not updated.');
    }

    return customerDetails;
  }

  async deleteCustomerDetailsById(id: string) {
    let customerDetails;
    try {
      customerDetails = await this.customerModel
        .remove({ $and: [{ isActive: true }, { customerId: id }] })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return customerDetails;
  }

  async deleteAllCustomerDetails() {
    let customerDetails;
    try {
      customerDetails = await this.customerModel
        .remove({ $and: [{ isActive: true }] })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return customerDetails;
  }
}
