'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

const MAX_TIMES = Number.MAX_SAFE_INTEGER;
const MIN_FREQUENCY = 1;

function Event(eventName, parentEvent) {
    this.eventName = eventName;
    this.children = [];
    this.parent = parentEvent;
    this.followers = [];
}

function Follower(context, handler, times, frequency) {
    this.context = context;
    this.handler = handler;
    this.times = times;
    this.frequency = frequency;
    this.callingCounter = 0;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {
        eventModel: {},
        getMostSpecificEvent: function (event) {
            initializeEventTree(event, this.eventModel);
            const namespace = event.split('.');
            const lessSpecificEvent = this.eventModel[namespace.shift()];

            return creatAndGetMostSpecificEvent(
                lessSpecificEvent,
                namespace
            );
        },

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            const mostSpecificEvent = this.getMostSpecificEvent(event);
            mostSpecificEvent.followers.push(
                new Follower(
                    context,
                    handler,
                    MAX_TIMES,
                    MIN_FREQUENCY
                )
            );

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            const mostSpecificEvent = this.getMostSpecificEvent(event);
            eventTreeTraversal(mostSpecificEvent, context);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            const mostSpecificEvent = this.getMostSpecificEvent(event);
            eventHosting(mostSpecificEvent);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            if (times <= 0) {
                return this.on(event, context, handler);
            }
            const mostSpecificEvent = this.getMostSpecificEvent(event);
            mostSpecificEvent.followers.push(
                new Follower(
                    context,
                    handler,
                    times,
                    MIN_FREQUENCY
                )
            );

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            if (frequency <= 0) {
                return this.on(event, context, handler);
            }
            const mostSpecificEvent = this.getMostSpecificEvent(event);
            mostSpecificEvent.followers.push(
                new Follower(
                    context,
                    handler,
                    MAX_TIMES,
                    frequency
                )
            );

            return this;
        }
    };
}

/**
 * Всплытие наиболее специфичного события вверх
 * По дереву событий с обработкой
 * @param{Event} mostSpecificEvent
 */
function eventHosting(mostSpecificEvent) {
    let currentEvent = mostSpecificEvent;
    while (currentEvent !== null) {
        currentEvent.followers.forEach(follower => {
            if (follower.times > 0 && follower.callingCounter % follower.frequency === 0) {
                follower.handler.call(follower.context);
                follower.times -= 1;
            }
            follower.callingCounter += 1;
        });
        currentEvent = currentEvent.parent;
    }
}

/**
 * Добавление корневого узла в дерево событий,
 * Если его ещё не существует
 * @param{String} event
 * @param{Object} eventModel
 */
function initializeEventTree(event, eventModel) {
    const namespace = event.split('.');
    const minSpecificEvent = namespace.shift();
    if (!eventModel[minSpecificEvent]) {
        eventModel[minSpecificEvent] = new Event(minSpecificEvent, null);
    }
}

/**
 * Построение недостающих узлов в дереве событий
 * И возврат самого специфичного события
 * @param{Event} currentEvent
 * @param{Array} namespace
 * @returns{Object} event
 */
function creatAndGetMostSpecificEvent(currentEvent, namespace) {
    let currentChildren = currentEvent.children;
    namespace.forEach(evt => {
        if (!currentChildren[evt]) {
            currentChildren[evt] = new Event(evt, currentEvent);
        }
        currentEvent = currentChildren[evt];
        currentChildren = currentEvent.children;
    });

    return currentEvent;
}

/**
 * Обход дерева событий для отписки от самого события
 * И всех его дочерних событий
 * @param{Event} rootEvent
 * @param{Object} context - объект, которого необходимо отписать от события
 */
function eventTreeTraversal(rootEvent, context) {
    getOffEvent(rootEvent, context);
    const children = Object.keys(rootEvent.children);
    children.forEach(clild => eventTreeTraversal(rootEvent.children[clild], context));
}

/**
 * Отписка от события
 * @param{Event} currentEvent
 * @param{Object} context - объект, которого необходимо отписать от события
 */
function getOffEvent(currentEvent, context) {
    currentEvent.followers = currentEvent.followers
        .filter(follower => follower.context !== context);
}

module.exports = {
    getEmitter,

    isStar
};
