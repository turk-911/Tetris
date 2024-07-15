import { CellOptions } from "../types";
interface Props {
    type: CellOptions;
};
export default function Cell({ type }: Props) {
    return <div className={`cell ${type}`} />
}