import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsString } from "class-validator";

@Schema()
export class Customer extends Document {
    @IsString()
    @Prop({ required: true })
    customerId: string;

    @IsString()
    @Prop({ required: true })
    customerName: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
