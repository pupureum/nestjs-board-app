import { Injectable, NotFoundException } from '@nestjs/common';
import { /*Board,*/ BoardStatus } from './board-status.enum';
import { v1 as uuid } from 'uuid'; //uuid 버전1 사용
import { CreateBoardDto } from './dto/create-board.dto';
// import { NotFoundError } from 'rxjs';
import { BoardRepository } from './board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardsService {

	//TypeORM을 쓸 때는 Ropository 패턴을 사용하므로 service에 repository를 종속성 주입(Injection)을 해줘야한다.
	constructor(
		@InjectRepository(BoardRepository)
		private boardRepository: BoardRepository,
	){}

	/*async getAllBoards(): Promise<Board[]> {
		return this.boardRepository.find();
	} */
	//해당 유저 게시물만 가져오기
	async getAllBoards(user: User): Promise<Board[]> {
		const query = this.boardRepository.createQueryBuilder('board');

		query.where('board.userId = :userId', { userId: user.id });

		const boards = await query.getMany();
		return boards;
	}
	//private boards: Board[] = [];
	// getAllBoards(): Board[] {
	// 	return this.boards;
	// }
   
	createBoard(createBoardDto: CreateBoardDto, user: User) : Promise<Board> {
		return this.boardRepository.createBoard(createBoardDto, user);
	}
	// createBoard(createBoardDto: CreateBoardDto) {
	// 	const {title, description} = createBoardDto;
	// 	const board: Board = {
	// 		id: uuid(), //uuid 모듈로 유니크한 값 부여
	// 		title, // title: title,와 같음
	// 		description, // description: description,
	// 		status: BoardStatus.PUBLIC
	// 	}

	// 	this.boards.push(board);
	// 	return board;
	// }

	async getBoardById(id: number): Promise<Board> {
		const found = await this.boardRepository.findOne(id);

		if(!found)
			throw new NotFoundException(`Can't find Board with id ${id}`);
		return found;
	}
	// getBoardById(id: string): Board { //board 하나를 return해주므로 type을 Board로 해준다. ([] X)
	// 	const found = this.boards.find((board) => board.id === id);

	// 	if(!found) {
	// 		throw new NotFoundException(`Can't find Board with id ${id}`); // 찾는 게시물 없는 경우, 예외 인스턴스 생성
	// 	}
	// 	return found;
	// }

	async deleteBoard(id: number, user: User): Promise<void> {
		 //remove사용하면 id 없는 경우 error 뱉기 때문에 id가 있는지 확인하는 작업 필요.
		//반면 delete는 id 없는 경우 아무런 일도 하지 않는다.
		const result = await this.boardRepository.delete({id, user}); 
		if(result.affected === 0) //delete된 경우 result의 affected, 즉 영향 받은 게시물 1이 된다. 
			throw new NotFoundException(`Can't find Board with id ${id}`)
		console.log('result', result);
	}
	// deleteBoard(id: string): void {
	// 	const found = this.getBoardById(id);
	// 	this.boards = this.boards.filter((board) => board.id !== found.id); //filter : id 같은것 지우고 다른것만 남겨준다
	// }
	
	async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
		const board = await this.getBoardById(id);

		board.status = status;
		await this.boardRepository.save(board);
		return board;
	}
	// updateBoardStatus(id: string, status: BoardStatus): Board {
	// 	const board = this.getBoardById(id);
	// 	board.status = status;
	// 	console.log(board);
	// 	return board;
	// }


}
