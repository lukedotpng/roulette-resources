import { MissionIDToShortDisplayText } from "@/utils/FormattingUtils";
import { MISSIONS } from "@/utils/globals";
import { Mission } from "@/types";
import { Fragment } from "react";
import {
    SeasonOneMissions,
    SeasonThreeMissions,
    SeasonTwoMissions,
} from "../../utils/SpinGlobals";

export default function QueueList({
    queueIndex,
    UpdateQueueIndex,
    missionQueue,
}: {
    queueIndex: number;
    UpdateQueueIndex: (index: number) => void;
    missionQueue: Mission[];
}) {
    const missionQueueLength = missionQueue.length;
    const missionQueueRows: Mission[][] = [];

    const queueIsTrilogy = QueueIsTrilogy(missionQueue);
    const queueIsSeason1 = QueueIsSeason1(missionQueue);
    const queueIsSeason2 = QueueIsSeason2(missionQueue);
    const queueIsSeason3 = QueueIsSeason3(missionQueue);

    let rowLength = 7;

    if (queueIsTrilogy) {
        const season1Row = missionQueue.slice(0, 6);
        const season2Row = missionQueue.slice(6, 14);
        const season3Row = missionQueue.slice(14, 19);
        missionQueueRows.push(season1Row);
        missionQueueRows.push(season2Row);
        missionQueueRows.push(season3Row);
    } else if (queueIsSeason1 || queueIsSeason2 || queueIsSeason3) {
        missionQueueRows.push([...missionQueue]);
    } else {
        if (missionQueueLength <= 8) {
            missionQueueRows.push([...missionQueue]);
            rowLength = missionQueueLength;
        } else {
            const rowCount = Math.floor(missionQueueLength / 2) > 7 ? 3 : 2;
            rowLength = Math.ceil(missionQueueLength / rowCount);

            for (let i = 0; i < rowCount; i++) {
                const rowStartIndex = i * rowLength;
                const rowEndIndex = rowLength + rowStartIndex;

                if (missionQueueLength - rowStartIndex < rowLength) {
                    const tempRow = missionQueue.slice(
                        rowStartIndex,
                        missionQueueLength,
                    );
                    missionQueueRows.push(tempRow);
                    break;
                }
                const tempRow = missionQueue.slice(rowStartIndex, rowEndIndex);
                missionQueueRows.push(tempRow);
            }
        }
    }

    return (
        <div className="flex w-full max-w-[48rem] flex-col gap-0 text-[.7em] sm:gap-2 sm:text-[.8em]">
            {missionQueueRows.map((row, rowIndex) => {
                let rowOffset = 0;

                if (queueIsTrilogy) {
                    rowOffset = [0, 6, 14][rowIndex];
                } else {
                    rowOffset = rowLength * rowIndex;
                }

                return (
                    <div
                        className="flex w-full flex-col gap-0 sm:gap-2"
                        key={rowIndex}
                    >
                        <div className="flex w-full">
                            {row.map((mission, index) => {
                                const isLastMission =
                                    rowOffset + index ===
                                    missionQueueLength - 1;
                                const isLastMissionInRow =
                                    index === row.length - 1;
                                // look at that beaut of variable name
                                const isFirstInRowButNotFirstOverall =
                                    index === 0 && rowIndex !== 0;

                                return (
                                    <Fragment key={rowOffset + index}>
                                        <button
                                            data-active={
                                                rowOffset + index === queueIndex
                                            }
                                            className="group relative flex h-6 min-w-8 flex-1 items-center sm:min-w-16"
                                            onClick={() =>
                                                UpdateQueueIndex(
                                                    rowOffset + index,
                                                )
                                            }
                                        >
                                            {isFirstInRowButNotFirstOverall && (
                                                <div className="absolute -left-2 w-2 border-t-2 border-dotted border-white"></div>
                                            )}
                                            <span className="flex-1 bg-white px-0.5 py-1 text-zinc-900 group-data-[active=true]:bg-red-500 group-data-[active=true]:text-white">
                                                {MissionIDToShortDisplayText(
                                                    mission,
                                                )}
                                            </span>
                                        </button>
                                        {!isLastMission && (
                                            <div
                                                key={index + 123}
                                                data-lastinrow={
                                                    isLastMissionInRow
                                                }
                                                className="mt-3 w-4 border-t-2 border-white data-[lastinrow=true]:w-2 data-[lastinrow=true]:border-dotted data-[lastinrow=true]:border-white sm:w-10 data-[lastinrow=true]:sm:w-5"
                                            ></div>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </div>
                        {rowIndex !== missionQueueRows.length - 1 && (
                            <div className="relative my-1 -ml-2 h-0 border-t-2 border-dotted border-white">
                                <div className="absolute -top-4 right-0 h-4 border-l-2 border-dotted border-white sm:-top-6 sm:h-6"></div>
                                <div className="absolute top-0 left-0 h-4 border-l-2 border-dotted border-white sm:h-6"></div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function QueueIsTrilogy(missionQueue: Mission[]) {
    if (MISSIONS.length !== missionQueue.length) {
        return false;
    }
    for (let i = 0; i < MISSIONS.length; i++) {
        if (missionQueue[i] !== MISSIONS[i]) {
            return false;
        }
    }
    return true;
}
function QueueIsSeason1(missionQueue: Mission[]) {
    if (SeasonOneMissions.length !== missionQueue.length) {
        return false;
    }
    for (let i = 0; i < SeasonOneMissions.length; i++) {
        if (missionQueue[i] !== SeasonOneMissions[i]) {
            return false;
        }
    }
    return true;
}
function QueueIsSeason2(missionQueue: Mission[]) {
    if (SeasonTwoMissions.length !== missionQueue.length) {
        return false;
    }
    for (let i = 0; i < SeasonTwoMissions.length; i++) {
        if (missionQueue[i] !== SeasonTwoMissions[i]) {
            return false;
        }
    }
    return true;
}
function QueueIsSeason3(missionQueue: Mission[]) {
    if (SeasonThreeMissions.length !== missionQueue.length) {
        return false;
    }
    for (let i = 0; i < SeasonThreeMissions.length; i++) {
        if (missionQueue[i] !== SeasonThreeMissions[i]) {
            return false;
        }
    }
    return true;
}
