import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from "class-validator";

export class CustomerDto {
    @IsString()
    @IsNotEmpty()
    customerId: string;

    @IsString()
    @IsNotEmpty()
    customerName: string;
}