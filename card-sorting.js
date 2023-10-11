//cardsorting
const dataEvent = new Event('dataEvent');
let completeContinueHintOneButtonsFlag = false;
let dragData = {};

var cardsortingcomponent = document.getElementsByClassName("cardsorting");
for (let i = 0; i < cardsortingcomponent.length; i++) {
    const cardsortingcount = cardsortingcomponent[i];
    let processClass = cardsortingcount.getAttribute('class').split(" ");
    cardsortingcount.classList.add('cardsortinglist_' + i);
    let onDragItemParentName;
    //Tick icon generate
    let tickIcon = "<svg class='checkmark' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52'><circle class='checkmark__circle' cx='26' cy='26' r='25' fill='none'/><path class='checkmark__check' fill='none' d='M14.1 27.2l7.1 7.2 16.7-16.8'/></svg>";

    var countItems = document.querySelector(".cardsorting .sorting__row.items").childElementCount;
    let totalCount = countItems;
    var correctItems = 0;
    let cardCompleteUI;

    countPlayCards(correctItems);

    /* Card Sorting Code start  */
    function onDragStart(event) {

        const targetTextData = event.target.id || (event.touches && event.touches[0].target.id);

        dragData = {
            text: targetTextData,
            dataAttr: event.target.dataset.attr || (event.touches && event.touches[0].target.dataset.attr)
        };

        const currentTarget = event.currentTarget || event.target;
        currentTarget.style.backgroundColor = 'white';
        currentTarget.style.border = '1px solid rgba(0,0,0,.3)';
        currentTarget.style.borderTop = '3px solid #ff631e';
    }

    function onDragOver(event) {
        event.preventDefault();
    }

    function onDrop(event) {
        const droppedData = dragData;
        const dataAttr = droppedData.dataAttr;

        const id = droppedData.text;
        dragData = {};

        if (event.changedTouches) {
            var touch = event ?.changedTouches[0];
            var touchedElement = document.elementFromPoint(touch ?.clientX, touch ?.clientY);
            onDragItemParentName = touchedElement.getAttribute("data-attr");
        } else {
            onDragItemParentName = event.target.getAttribute("data-attr");
        }


        if (onDragItemParentName === dataAttr) {


            if (event.changedTouches) {
                var touch = event ?.changedTouches[0];
                var touchedElement = document.elementFromPoint(touch ?.clientX, touch ?.clientY);
                touchedElement.getElementsByTagName('div')[1].appendChild(document.getElementById(id));
            } else {
                event.target.querySelector(`.cardsortinglist_${i}` + ' .sort__content').appendChild(document.getElementById(id));
            }

            // tick mark icon
            document.getElementById(id).insertAdjacentHTML('beforeend', tickIcon);
            correctItems++;
        } else {
            correctItems--;
        }
        if (correctItems < 0) {
            correctItems = 0;
        }
        let cardPlayBox = document.querySelectorAll('.card-complete');
        if (cardPlayBox.length > 0) {
            $(`.cardsortinglist_${i}` + '.cardsorting .sorting__row.items .card-complete').remove();
        }
        $(`.cardsortinglist_${i}` + '.cardsorting .sorting__row.items').append(countPlayCards(correctItems));

        var countItemCards = document.querySelector(".cardsorting .sorting__row.items").childElementCount;
        if (countItemCards - 1 == 0) {
            completeContinueHintOneButtonsFlag = true;

            dataEvent.data = completeContinueHintOneButtonsFlag;
            document.dispatchEvent(dataEvent);
        }

        setTimeout(() => {
            $(`.cardsortinglist_${i}` + ' .sorting__row.category .sort__content [data-attr]').each(function(item, i) {
                $(i).addClass('droppedList');
            })
        }, 2000);
    }

    $('.cardsorting .sorting__row.category [data-attr]').each(function(i, item) {
        $(item).attr('ondragover', 'onDragOver(event);');
        $(item).attr('ondrop', 'onDrop(event);');
        $(item).attr('class', 'example-draggable');
    });


    $('.cardsorting .sorting__row.items [data-attr]').each(function(i, item) {
        $(item).attr('id', `draggable-${i+1}`);
        $(item).attr('style', `z-index: ${(countItems+1)-1}`);
        $(item).attr('draggable', true);
        $(item).attr('ondragstart', "onDragStart(event);");
        $(item).attr('class', 'example-dropzone');
        countItems--;
    });


    function countPlayCards(correctItems) {
        // card-result and replay button
        cardCompleteUI = `
                <div class="card-complete">
                    <div class="card__cardholder">
                        <div class="cardholder__title">${correctItems}/${totalCount}  Cards Correct</div>
                        <button type="button" class="restart-button" onclick="replayCards()">
                            <div class="restart-button__content">
                                <span class="restart-button__text">REPLAY</span>
                                <i class="fa fa-refresh" aria-hidden="true"></i>
                            </div>
                        </button>
                    </div>
                </div>
               `;
        return cardCompleteUI;
    }

    // replay cards functionality
    function replayCards() {
        $(`.cardsortinglist_${i}` + '.cardsorting .sorting__row.items .card-complete').remove();
        document.querySelectorAll(`.cardsortinglist_${i}` + '.cardsorting .sorting__row.category  h1').forEach(function(item, index) {
            let dataAttr = item.getAttribute('data-attr');

            let catSortData_dataAttr = document.querySelector(`.cardsortinglist_${i}` + '.cardsorting .sorting__row.category ' + 'h1[data-attr=' + '"' + `${dataAttr}` + '"' + "] .sort__content");

            let catSortData_dataAttrHtml = catSortData_dataAttr.innerHTML;

            let catSortData_Para = document.querySelectorAll(`.cardsortinglist_${i}` + '.cardsorting .sorting__row.category ' + 'h1[data-attr=' + '"' + `${dataAttr}` + '"' + "] .sort__content p").forEach(function(item, index) {
                $(item).children('svg').remove();
                $(item).removeAttr('style');
                let itemLength = catSortData_dataAttr.children.length;
                $(item).attr('style', `z-index: ${(itemLength+1)-1}`);
                $(`.cardsortinglist_${i}` + '.cardsorting .sorting__row.items').append(item);
            });

            catSortData_dataAttr.innerHTML = "";
        });
        var countItems = document.querySelector(".cardsorting .sorting__row.items").childElementCount;
        $('.cardsorting .sorting__row.items [data-attr]').each(function(i, item) {
            $(item).attr('id', `draggable-${i+1}`);
            $(item).attr('style', `z-index: ${(countItems+1)-1}`);
            $(item).attr('draggable', true);
            $(item).attr('ondragstart', "onDragStart(event);");
            $(item).attr('class', 'example-dropzone');
            countItems--;
        });
        correctItems = 0;
    }

    let auto_refresh = setInterval(function() {
        let count = document.querySelector(`.cardsortinglist_${i}` + ".cardsorting .sorting__row.category").childElementCount;

        while (count > 4) {
            $(`.cardsortinglist_${i}` + '.cardsorting .sorting__row.category h1:last-child').remove();
            count = $(`.cardsortinglist_${i}` + '.cardsorting .sorting__row.category h1').length;
        }
    }, 1000);

    $(`.cardsortinglist_${i}` + '.cardsorting .sorting__row.items [data-attr]').each(function(i, item) {
        item.addEventListener('touchstart', function(event) {
            onDragStart(event);
        });
        item.addEventListener('touchend', function(event) {
            onDrop(event);
        });
        item.addEventListener('touchmove', function(event) {
            onDragOver(event);
        });
    });

}