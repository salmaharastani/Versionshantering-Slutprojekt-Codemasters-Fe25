document.addEventListener('DOMContentLoaded', () => {
  const messagesContainer = document.getElementById('messagesContainer');

  messagesContainer.addEventListener('mouseover', (e) => {
    if (e.target.closest('.message-card')) {
      const card = e.target.closest('.message-card');
      const timeElement = card.querySelector('small');
      const time = timeElement ? timeElement.textContent : 'Unknown time';

     
      let tooltip = document.getElementById('hover-tooltip');
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'hover-tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '8px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '12px';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.zIndex = '1000';
        document.body.appendChild(tooltip);
      }

      tooltip.textContent = `Skapad: ${time}`;
      tooltip.style.left = (e.pageX + 10) + 'px';
      tooltip.style.top = (e.pageY + 10) + 'px';
      tooltip.style.display = 'block';
    }
  });

  messagesContainer.addEventListener('mouseout', (e) => {
    if (e.target.closest('.message-card')) {
      const tooltip = document.getElementById('hover-tooltip');
      if (tooltip) {
        tooltip.style.display = 'none';
      }
    }
  });


  window.addEventListener('scroll', () => {
    const tooltip = document.getElementById('hover-tooltip');
    if (tooltip) tooltip.style.display = 'none';
  });
});
