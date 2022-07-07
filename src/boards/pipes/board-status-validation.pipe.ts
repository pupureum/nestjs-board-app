import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { BoardStatus } from "../board-status.enum";

export class BoardStatusValidationPipi implements PipeTransform {
	readonly StatusOption = [
		BoardStatus.PRIVATE,
		BoardStatus.PUBLIC
	]
	transform(value: any, metadata: ArgumentMetadata) { // transform() 첫번째 파라미터 : 처리가 된 인자 값, 두번쩨 : 인자에 대한 메타데이터 포함한 객체
		value = value.toUpperCase();
		
		if(!this.isStatusValid(value)){
			throw new BadRequestException(`${value} isn't in the status options`);
		}

		return value;
	}

	private isStatusValid(status: any) {
		const index = this.StatusOption.indexOf(status);
		return index !== -1
	}
}