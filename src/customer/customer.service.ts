import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LOGGER } from '../common/core.module';
import {
  ApiSuccessResponse,
  CommonApiResponse,
} from '../common/models/api.models';
import { Logger } from 'winston';
import { ClientSession } from 'mongoose';
import { CustomerRepository } from './repository/customer.repository';
import { CustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @Inject(LOGGER) private readonly logger: Logger,
    private readonly customerRepository: CustomerRepository,
  ) {}

  // Create
  async createCustomerDetails(
    createCustomerDto: CustomerDto,
  ): Promise<CommonApiResponse> {
    try {
      const customerDetails =
        await this.customerRepository.createCustomerDetails(createCustomerDto);
      const apiResult: CommonApiResponse<ApiSuccessResponse<string>> = {
        statusCode: HttpStatus.CREATED,
        timestamp: new Date().toISOString(),
        message: `Customer created successfully.`,
        data: customerDetails,
      };
      return apiResult;
    } catch (error) {
      this.logger.error('[CustomerService]: ', error);
      return error;
    }
  }

  // Get one by ID
  async getCustomerDetailsById(id: string): Promise<CommonApiResponse> {
    try {
      const customerDetails =
        await this.customerRepository.getCustomerDetailsById(id);
      const apiResult: CommonApiResponse<ApiSuccessResponse<any>> = {
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        message: `Fetched Customers List successfully.`,
        data: customerDetails,
      };
      return apiResult;
    } catch (error) {
      this.logger.error('[CustomerService]: ', error);
      return error;
    }
  }

  // Get All
  async getCustomerDetails(): Promise<CommonApiResponse> {
    try {
      const customerDetails =
        await this.customerRepository.getCustomerDetails();
      const apiResult: CommonApiResponse<ApiSuccessResponse<any>> = {
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        message: `Fetched Customers List successfully.`,
        data: {
          customers: customerDetails.map((item) => {
            let res = {
              customerId: item.customerId,
              customerName: item.customerName,
            };
            return res;
          }),
        },
      };
      return apiResult;
    } catch (error) {
      this.logger.error('[CustomerService]: ', error);
      return error;
    }
  }

  // Update
  async updateCustomerDetails(
    createCustomerDto: CustomerDto,
  ): Promise<CommonApiResponse> {
    try {
      const customerDetails =
        await this.customerRepository.updateCustomerDetails(createCustomerDto);
      const apiResult: CommonApiResponse<ApiSuccessResponse<string>> = {
        statusCode: HttpStatus.CREATED,
        timestamp: new Date().toISOString(),
        message: `Customer details updated successfully.`,
        data: customerDetails,
      };
      return apiResult;
    } catch (error) {
      this.logger.error('[CustomerService]: ', error);
      return error;
    }
  }

  // Delete one by ID
  async deleteCustomerDetailsById(id: string): Promise<CommonApiResponse> {
    try {
      const customerDetails =
        await this.customerRepository.deleteCustomerDetailsById(id);
      const apiResult: CommonApiResponse<ApiSuccessResponse<any>> = {
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        message: `Deleted Customer successfully.`,
        data: customerDetails,
      };
      return apiResult;
    } catch (error) {
      this.logger.error('[CustomerService]: ', error);
      return error;
    }
  }

  // Delete All
  async deleteAllCustomerDetails(): Promise<CommonApiResponse> {
    try {
      const customerDetails =
        await this.customerRepository.deleteAllCustomerDetails();
      const apiResult: CommonApiResponse<ApiSuccessResponse<any>> = {
        statusCode: HttpStatus.OK,
        timestamp: new Date().toISOString(),
        message: `Deleted All Customers successfully.`,
        data: customerDetails,
      };
      return apiResult;
    } catch (error) {
      this.logger.error('[CustomerService]: ', error);
      return error;
    }
  }
}
