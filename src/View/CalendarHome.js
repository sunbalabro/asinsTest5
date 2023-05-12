import FullCalendar from '@fullcalendar/react';
import React, { useRef, useState } from 'react';
import { Button, Modal, Form, Input , Calendar, theme, Row, Col, TimePicker  } from 'antd';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthYear from '@fullcalendar/multimonth';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment/moment';
import dayjs from 'dayjs';
import listPlugin from '@fullcalendar/list';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
export const CalendarHome = (props) => {
  const [events , setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate , setSelectedDate] = useState('');
  const [pickedDate , setPickedDate] = useState(null)
  const { token } = theme.useToken();
  const calendarRef = useRef(null);
  const [startTimeValue, setStartTimeValue] = useState(null);
  const [endTimeValue, setEndTimeValue] = useState(null);
 
  const format = 'HH:mm';
  const handleStartTime = (e) =>{
    setStartTimeValue(e.format('HH:mm'))
  }
  const handleEndTime = (e) =>{
    setEndTimeValue(e.format('HH:mm'))
  }
  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    margin: "0 auto",
    marginTop: '20px'
  };
  const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode , value);
    setPickedDate(value.format('YYYY-MM-DD'))
    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      calendarApi.gotoDate(value.format('YYYY-MM-DD'))
    }
  };
  const handleEvents = (info) =>{ 
    setIsModalOpen(true);
    const date = info.date.format('YYYY-MM-DD')
    const newDate = date.format('YYYY-MM-DD')
    setSelectedDate(info.date.format('YYYY-MM-DD'))
    console.log({info})
  }
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedDate('')
  };
  const onFinish = (values) => {
    const id = uuidv4().toString()
    const newDate1 = selectedDate + 'T' + startTimeValue
    const newDate2 = selectedDate + 'T' + endTimeValue
    const newEvent = {
      id: id,
      title: values.eventTitle,
      start: newDate1,
      end: newDate2,
      // startTime: startTimeValue,
      allDay : false
  };
  setEvents([...events, newEvent]);
  setIsModalOpen(false)
  setSelectedDate('')
  console.log({newEvent})
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  }
  const handleEventDrop = (info) => {
    const { event, oldEvent } = info;
    if (!event || !event.start || !event.end) return;
  
    const updatedEvent = {
      id: event.id,
      title: event.title,
      allDay: event.allDay,
      start: event.start instanceof Date ? event.start.toISOString() : event.start,
      end: event.end instanceof Date ? event.end.toISOString() : event.end,
    }
  
    const updatedEvents = events.map((e) => (e.id === oldEvent.id ? updatedEvent : e));
    setEvents(updatedEvents);
    console.log({updatedEvents})
}

const handleEventDrag = (info) =>{
   const {event} = info
   if (!event || !event.start || !event.end) return;


}

  return(
    <div className='calendarContainer'>
        <h1>Calendar</h1>
        <Row>
          <Col md={{span: 12}} lg={{span: 6}} style={{border: '1px solid black'}}>
          <div style={wrapperStyle}>
      <Calendar fullscreen={false} onSelect={onPanelChange} defaultValue={selectedDate.length !== 0 ? moment(selectedDate).to : null} />
    </div>  
          </Col>
        <Col  md={{span: 18}}   style={{border: '1px solid black'}}>
        <FullCalendar
           plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin,multiMonthYear , bootstrap5Plugin , listPlugin]}
           initialView='dayGridMonth'
           headerToolbar={
            {
              start: 'today prev,next',
              center: 'title',
              end: 'dayGridMonth,timeGridWeek,timeGridDay,multiMonthYear,listWeek'
            }
           }
           dateClick={handleEvents}
           events={events}
           eventDrop={handleEventDrop}
           editable={true} 
           nowIndicator={true}
           dayMaxEventRows= {true}
           timeZone='local'
           themeSystem= 'bootstrap5'
           ref={calendarRef}
           eventDragStop={handleEventDrag}
           droppable= {true}
        />
        </Col>
        
           </Row>
         <Modal title="Add Event" open={isModalOpen} onCancel={handleCancel} footer={null}>
         <Form
     name="basic"
     labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 16,
    }}
    style={{
      maxWidth: 600,
    }}
    initialValues={{
      remember: true,
    }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="Event Title"
      name="eventTitle"
      rules={[
        {
          required: true,
          message: 'Please input your event title!',
        },
      ]}
    >
      <Input />
    </Form.Item>
    <Form.Item 
      label="Start Time"
      name='startTime'
    >
    <TimePicker defaultValue={dayjs('12:08', format)} format={format} onSelect={handleStartTime} />;
    </Form.Item>
    <Form.Item 
      label="End Time"
      name='endTime'
    >
    <TimePicker defaultValue={dayjs('12:08', format)} format={format} onSelect={handleEndTime} />;
    </Form.Item>
    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit">
        Create
      </Button>
    </Form.Item>
  </Form>
      </Modal>
        
    </div>
   )

 }