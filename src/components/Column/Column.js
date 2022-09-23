import React from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import './Column.scss'
import Card from '../Card/Card'
import { mapOrder } from '../../ultilities/sort'

function Column(props) {
  const { column, onCardDrop } = props
  const cards = mapOrder(column.cards, column.cardOrder, 'id')

  //cha-con
  // const onCardDrop = (columnId, dropResult) => {
  //   if (dropResult.removeIndex !== null || dropResult.addedIndex !== null) {
  //     console.log(columnId)
  //     console.log(dropResult)
  //   }

  // }

  return (
    <div className='column'>
      <header className='column-drag-handle'>{column.title}</header>
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
      </div>
      <footer>
        <div className='footer-actions'>
          <i className='fa fa-plus icon'>Add another card</i>
        </div>
      </footer>
    </div>
  )

}

export default Column