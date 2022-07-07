import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UsePipes, ValidationPipe, UseGuards, Logger } from '@nestjs/common';
import { /*Board,*/ BoardStatus } from './board-status.enum';
import { Board } from './board.entity';
import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipi } from './pipes/board-status-validation.pipe';
import { GetUser } from 'src/auth/get-user.decorator';
import { create } from 'domain';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
	private logger = new Logger('BoardsController');
	constructor(private boardsService: BoardsService) {}
	
	//모든 게시물 가져오기
	/*@Get()
	getAllBoard(): Promise<Board[]> {
		return this.boardsService.getAllBoards();
	}*/

	//해당 유저의 게시물만 가져오기
	@Get()
	getAllBoard(
		@GetUser() user: User
	): Promise<Board[]> {
		this.logger.verbose(`User ${user.username} trying to get all boards`);
			return this.boardsService.getAllBoards(user);
	}
	

	// @Get('/')
	// getAllBoard(): Board[] {
	// 	return this.boardsService.getAllBoards();
	// }

	@Post()
	@UsePipes(ValidationPipe)
	createBoard(@Body() createBoardDto: CreateBoardDto,
	@GetUser() user:User) : Promise<Board> {
		this.logger.verbose(`User ${user.username} creating a new board.
		Payload: ${JSON.stringify(createBoardDto)}`)
		return this.boardsService.createBoard(createBoardDto, user);
	}
	// @Post()
	// @UsePipes(ValidationPipe) // 유효성 체크 파이프
	// createBoard(
	// 	@Body() createBoardDto: CreateBoardDto
	// 	): Board { //return 해주는 것이 board 전체가 아닌 하나이므로 [] 없앤다.
	// 		return this.boardsService.createBoard(createBoardDto);
	// }

	@Get('/id')
	getBoardById(@Param('id') id:number) : Promise<Board> {
		return this.boardsService.getBoardById(id);
	}
	// @Get('/:id')
	// getBoardById(@Param('id') id: string): Board { //parameter 2개 이상 한꺼번에 가져올 시 @Param() params: string[]
	// 	return this.boardsService.getBoardById(id)
	// }

	@Delete('/:id')
	deleteBoard(@Param('id', ParseIntPipe) id,
	@GetUser() user:User): Promise<void> {
		return this.boardsService.deleteBoard(id, user);
	}
	// @Delete('/:id')
	// deleteBoard(@Param('id') id: string): void {
	// 	this.boardsService.deleteBoard(id);
	// }

	@Patch('/:id/status')
	updateBoardStatus(
		@Param('id', ParseIntPipe) id: number,
		@Body('status', BoardStatusValidationPipi) status: BoardStatus
	) {
		return this.boardsService.updateBoardStatus(id, status);
	}
	

}


