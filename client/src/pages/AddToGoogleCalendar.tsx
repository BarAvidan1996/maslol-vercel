import React from 'react';

interface AddToGoogleCalendarProps {
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
}

const AddToGoogleCalendar: React.FC<AddToGoogleCalendarProps> = ({
  title,
  description,
  location,
  startTime,
  endTime,
}) => {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]|\.\d{3}/g, '');
  };

  const handleAddToCalendar = () => {
    const start = formatDate(startTime);
    const end = formatDate(endTime);
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${start}/${end}&details=${encodeURIComponent(
      description
    )}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

    window.open(url, '_blank');
  };

	return (
	  <div style={{ marginTop: '20px' }}>
	    <button
	      onClick={handleAddToCalendar}
	      style={{
		padding: '10px 16px',
		backgroundColor: '#4285F4',
		color: 'white',
		border: 'none',
		borderRadius: '6px',
		cursor: 'pointer',
		fontSize: '16px',
	      }}
	    >
	      הוסף ליומן גוגל
	    </button>
	  </div>
	);
};

export default AddToGoogleCalendar;
