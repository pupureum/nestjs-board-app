import { Injectable, NotFoundException } from '@nestjs/common';
import { Board, BoardStatus } from './board.model';
import { v1 as uuid } from 'uuid'; //uuid 버전1 사용
import { CreateBoardDto } from './dto/create-board.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class BoardsService {
	private boards: Board[] = [];

	getAllBoards(): Board[] {
		return this.boards;
	}

	createBoard(createBoardDto: CreateBoardDto) {
		const {title, description} = createBoardDto;
		const board: Board = {
			id: uuid(), //uuid 모듈로 유니크한 값 부여
			title, // title: title,와 같음
			description, // description: description,
			status: BoardStatus.PUBLIC
		}

		this.boards.push(board);
		return board;
	}

	getBoardById(id: string): Board { //board 하나를 return해주므로 type을 Board로 해준다. ([] X)
		const found = this.boards.find((board) => board.id === id);

		if(!found) {
			throw new NotFoundException(`Can't find Board with id ${id}`); // 찾는 게시물 없는 경우, 예외 인스턴스 생성
		}
		return found;
	}

	deleteBoard(id: string): void {
		const found = this.getBoardById(id);
		this.boards = this.boards.filter((board) => board.id !== found.id); //filter : id 같은것 지우고 다른것만 남겨준다
	}

	updateBoardStatus(id: string, status: BoardStatus): Board {
		const board = this.getBoardById(id);
		board.status = status;
		console.log(board);
		return board;
	}
}
