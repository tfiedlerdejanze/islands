import React from 'react';
import ReactDOMServer from 'react-dom/server';

import PropTypes from 'prop-types';

import classNames from 'classnames';
import s from './Lightbox.scss';

const print = (html) => {
    const printWindow = window.open('','','width=600,height=800');
    printWindow.document.write(ReactDOMServer.renderToStaticMarkup(html));
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
};

const Lightbox = ({
    onRequestClose,
    hasCloseButton,
    isPrintable,
    isLoading,
    isOpen,
    children,
}) => {
    const className = classNames({
        [s.Lightbox]: true,
        [s.Lightbox__open]: isOpen,
    });

    return (
        <div className={className}>
            <div className={s.Lightbox__window}>
                {hasCloseButton &&
                    <div onClick={onRequestClose} className={classNames(s.Lightbox__closer)}>
                    </div>
                }

                {isPrintable && !isLoading &&
                    <div onClick={() => print(children)} className={classNames(s.Lightbox__print)}>
                    </div>
                }

                { isLoading &&
                    "Loading..."
                }

                { !isLoading &&
                    <div className={s.Lightbox__window_outer}>
                        <div className={s.Lightbox__window_inner}>
                            {children}
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

Lightbox.defaultProps = {
};

Lightbox.propTypes = {
    /** show the loading spinner instead of the children */
    isLoading: PropTypes.bool,
    /** show a print icon */
    isPrintable: PropTypes.bool,
    /** if true, modal will be displayed with max-width: 660px on desktop, 100% mobile */
    isNarrow: PropTypes.bool,
    /** if true, the modal will be 200px from top */
    isPushToTop: PropTypes.bool,
    /** pass the open state from outside. closed by default */
    isOpen: PropTypes.bool,
    /** display a closing X in the top right corner */
    hasCloseButton: PropTypes.bool,
    /** toggle open state from outer component */
    onRequestClose: PropTypes.func,
    /** the modals content */
    children: PropTypes.node,
};

export default Lightbox;
