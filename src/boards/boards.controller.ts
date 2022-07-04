import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Board, BoardStatus } from './board.model';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipi } from './pipes/board-status-validation.pipe';

@Controller('boards')
export class BoardsController {
	constructor(private boardsService: BoardsService) {}

	@Get('/')
	getAllBoard(): Board[] {
		return this.boardsService.getAllBoards();
	}

	@Post()
	@UsePipes(ValidationPipe) // 유효성 체크 파이프
	createBoard(
		@Body() createBoardDto: CreateBoardDto
		): Board { //return 해주는 것이 board 전체가 아닌 하나이므로 [] 없앤다.
			return this.boardsService.createBoard(createBoardDto);
	}

	@Get('/:id')
	getBoardById(@Param('id') id: string): Board { //parameter 2개 이상 한꺼번에 가져올 시 @Param() params: string[]
		return this.boardsService.getBoardById(id)
	}

	@Delete('/:id')
	deleteBoard(@Param('id') id: string): void {
		this.boardsService.deleteBoard(id);
	}

	@Patch('/:id/status')
	updateBoardStatus(
		@Param('id') id: string,
		@Body('status', BoardStatusValidationPipi) status: BoardStatus
	): Board {
		return this.boardsService.updateBoardStatus(id, status)
	}

}


