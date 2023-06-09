import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LOGGER } from '../common/core.module';
import { CommonExceptionFilter } from '../common/filters/common-exception.filter';
import { CommonApiResponse } from '../common/models/api.models';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CustomerService } from './customer.service';
import { CustomerDto } from './dto/customer.dto';
import { Logger } from 'winston';


@ApiTags('customer')
@UseFilters(CommonExceptionFilter)
@Controller({
    path: 'customer',
    version: '1'
})
export class CustomerController {
    constructor(private readonly customerService: CustomerService,
        @Inject(LOGGER) private readonly logger: Logger,
        @InjectConnection() private readonly connection: Connection) { }

    @Post('/create')
    async createCustomerDetails(@Body() customerDto: CustomerDto): Promise<CommonApiResponse> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            this.logger.info('[CustomerController]: Api called to create Customer.')
            const newUser: any = await this.customerService.createCustomerDetails(customerDto, session);
            await session.commitTransaction();
            return newUser;
        } catch (error) {
            await session.abortTransaction();
            this.logger.error(`[CustomerController]: Error while creating Customer: ${error}`)
            throw error
        } finally {
            session.endSession();
        }
    }


    @Get('/:id')
    async getCustomerDetailsById(@Param('id') id: string): Promise<CommonApiResponse> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            this.logger.info('[CustomerController]: Api called to fetching Customer details.')
            const newUser: any = await this.customerService.getCustomerDetailsById(id);
            await session.commitTransaction();
            return newUser;
        } catch (error) {
            await session.abortTransaction();
            this.logger.error(`[CustomerController]: Error while fetching Customer details: ${error}`)
            throw error
        } finally {
            session.endSession();
        }
    }


    @Get('/')
    async getCustomerDetails(): Promise<CommonApiResponse> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            this.logger.info('[CustomerController]: Api called to fetch all Customer Details.')
            const newUser: any = await this.customerService.getCustomerDetails();
            await session.commitTransaction();
            return newUser;
        } catch (error) {
            await session.abortTransaction();
            this.logger.error(`[CustomerController]: Error while fetching all Customer Details: ${error}`)
            throw error
        } finally {
            session.endSession();
        }
    }


    @Patch('/update')
    async updateCustomerDetails(@Body() customerDto: CustomerDto): Promise<CommonApiResponse> {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            this.logger.info('[CustomerController]: Api called to update Customer.')
            const newUser: any = await this.customerService.updateCustomerDetails(customerDto, session);
            await session.commitTransaction();
            return newUser;
        } catch (error) {
            await session.abortTransaction();
            this.logger.error(`[CustomerController]: Error while updating Customer: ${error}`)
            throw error
        } finally {
            session.endSession();
        }
    }


    @Delete('/:id')
    async deleteCustomerDetailsById(@Param('id') id: string): Promise<CommonApiResponse> {
        try {
            this.logger.info('[CustomerController]: Api called to create Customer.')
            const newUser: any = await this.customerService.deleteCustomerDetailsById(id);
            return newUser;
        } catch (error) {
            this.logger.error(`[CustomerController]: Error while creating Customer: ${error}`)
            throw error
        }
    }


    @Delete('/')
    async deleteAllCustomerDetails(): Promise<CommonApiResponse> {
        try {
            this.logger.info('[CustomerController]: Api called to delete all Customers.')
            const newUser: any = await this.customerService.deleteAllCustomerDetails();
            return newUser;
        } catch (error) {
            this.logger.error(`[CustomerController]: Error while deleting Customer: ${error}`)
            throw error
        }
    }
}
