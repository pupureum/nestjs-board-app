import { EntityRepository, Repository } from "typeorm";
import { BoardStatus } from "./board-status.enum";
import { Board } from "./board.entity";
import { CreateBoardDto } from "./dto/create-board.dto";
import { User } from 'src/auth/user.entity';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
	
	async createBoard(createBoaardDto: CreateBoardDto, user: User) : Promise<Board> {
		const {title, description} = createBoaardDto;

		const board = this.create({
			title,
			description,
			status: BoardStatus.PUBLIC,
			user
		})

		await this.save(board);
		return board;
	}
}