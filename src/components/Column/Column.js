import React, { useEffect, useRef, useState } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { Dropdown, Form, Button } from 'react-bootstrap'
import { cloneDeep } from 'lodash'
import './Column.scss'
import Card from '../Card/Card'
import ConfirmModal from '../Common/ConfirmModal'
import { mapOrder } from '../../ultilities/sort'
import { MODAL_ACTION_CONFIRM } from '../../ultilities/constants'
import { selectAllInlineText, saveContentAfterPressEnter } from '../../ultilities/contentEditTable'


function Column(props) {
  const { column, onCardDrop, onUpdateColumn } = props
  const cards = mapOrder(column.cards, column.cardOrder, 'id')

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)

  const [columnTitle, setColumnTitle] = useState('')
  const handleColumnTitleChange = ((e) => setColumnTitle(e.target.value))

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const newCardTextareRef = useRef(null)

  const [newCardTitle, setNewCardTitle] = useState('')
  const onNewCardTitleChange = ((e) => setNewCardTitle(e.target.value))

  useEffect(() => {
    setColumnTitle(column.title)
  }, [column.title])

  useEffect(() => {
    if (newCardTextareRef && newCardTextareRef.current) {
      newCardTextareRef.current.focus()
      newCardTextareRef.current.select()
    }
  }, [openNewCardForm])

  const onConfirmModalAction = (type) => {

    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = {
        ...column,
        _destroy: true
      }
      onUpdateColumn(newColumn)
    }
    toggleShowConfirmModal()
  }


  const handleColumnTitleBlur = () => {
    const newColumn = {
      ...column,
      title: columnTitle
    }
    onUpdateColumn(newColumn)
  }

  const addNewCard = () => {
    if (!newCardTitle) {
      newCardTextareRef.current.focus()
      return
    }
    const newCardToAdd ={
      id: Math.random().toString(36).substr(2, 5),
      boardId: column.boardId,
      columnId: column.id,
      title:newCardTitle.trim(),
      cover:null
    }

    let newColumn = cloneDeep(column)
    newColumn.cards.push(newCardToAdd)
    newColumn.cardOrder.push(newCardToAdd.id)

    onUpdateColumn(newColumn)
    setNewCardTitle('')
    toggleOpenNewCardForm()
  }


  //cha-con
  // const onCardDrop = (columnId, dropResult) => {
  //   if (dropResult.removeIndex !== null || dropResult.addedIndex !== null) {
  //     console.log(columnId)
  //     console.log(dropResult)
  //   }

  // }

  return (
    <div className='column'>
      <header className='column-drag-handle'>
        <div className='column-title'>
          <Form.Control className='dyno-content-edittable'
            size="sm" type="text"
            value={columnTitle}
            onChange={handleColumnTitleChange}
            onBlur={handleColumnTitleBlur}
            onKeyDown={saveContentAfterPressEnter}
            spellCheck="false"
            onClick= {selectAllInlineText}

          />
        </div>
        <div className='column-dropdown-actions'>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic" size='sm' className='dropdown-btn'/>


            <Dropdown.Menu>
              <Dropdown.Item onClick={toggleOpenNewCardForm}>Add card ...</Dropdown.Item>
              <Dropdown.Item onClick={toggleShowConfirmModal}>Remove column ...</Dropdown.Item>
              <Dropdown.Item >Move all cards in this column ...</Dropdown.Item>
              <Dropdown.Item >Archive all cards in this column ...</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

      </header>
      <div className="card-list">
        <Container
          groupName="col"
          onDrop={dropResult => onCardDrop(column.id, dropResult)}
          getChildPayload={index => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'card-drop-preview'
          }}
          dropPlaceholderAnimationDuration={200}
        >

          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card card={card} />
            </Draggable>
          )) }

        </Container>
        {openNewCardForm &&
          <div className='add-new-card-area'>
            <Form.Control className='textarea-enter-new-card'
              size="sm" as="textarea" placeholder="Enter a title a this card..."
              rows="3"
              ref={newCardTextareRef}
              value={newCardTitle} onChange={onNewCardTitleChange}
              onKeyDown={event => (event.key === 'Enter' && addNewCard())}
            />

          </div>
        }
      </div>
      <footer>
        {openNewCardForm &&
          <div className='add-new-card-actions'>
            <Button variant="success" size='sm' onClick={addNewCard}>Add card</Button>
            <span className='cancel-icon' onClick={toggleOpenNewCardForm}>
              <i className='fa fa-trash icon'></i>
            </span>
          </div>
        }
        {!openNewCardForm &&
           <div className='footer-actions' onClick={toggleOpenNewCardForm}>
             <i className='fa fa-plus icon'>Add another card</i>
           </div>
        }
      </footer>

      <ConfirmModal
        show = {showConfirmModal}
        onAction={onConfirmModalAction}
        title="Remove column"
        content={`Are you sure you want to remove ${column.title}`}
      />
    </div>
  )

}

export default Column