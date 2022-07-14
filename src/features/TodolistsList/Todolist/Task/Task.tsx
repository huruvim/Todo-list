import React, {useCallback} from 'react';
import {EditableSpan} from 'components/business/EditableSpan/EditableSpan';
import {tasksActions} from '../../index';
import {useActions} from 'utils/redux-utils';
import {TaskStatuses, TaskType} from 'utils/api/types';
import {CheckBox} from 'components/ui/CheckBox/CheckBox';
import {DeleteIcon} from 'components/ui/DeleteIcon/DeleteIcon';

interface TaskProps {
  task: TaskType;
  todolistId: string;
}

export const Task: React.FC<TaskProps> = React.memo(({task, todolistId}) => {
  const {removeTask, updateTask} = useActions(tasksActions);

  const onClickHandler = useCallback(
    () => removeTask({taskId: task.id, todolistId}),
    [task.id, todolistId]
  );

  const onChangeHandler = useCallback(
    (isChecked: boolean) => {
      const status = isChecked ? TaskStatuses.Completed : TaskStatuses.New;
      updateTask({taskId: task.id, model: {status}, todolistId});
    },
    [task.id, todolistId]
  );

  const onTitleChangeHandler = useCallback(
    (newValue: string) => {
      updateTask({taskId: task.id, model: {title: newValue}, todolistId});
    },
    [task.id, todolistId]
  );

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
      <CheckBox
        isChecked={task.status === TaskStatuses.Completed}
        onChangeHandler={onChangeHandler}
      />
      <EditableSpan value={task.title} onChange={onTitleChangeHandler} />
      <DeleteIcon onClick={onClickHandler} />
    </div>
  );
});
