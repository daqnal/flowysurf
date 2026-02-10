export default function ExitConfirmModal({ setShowConfirm, setPageIndex }) {
    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Leave map?</h3>
                <p className="py-4">If you go home now you will lose unsaved changes. Continue?</p>
                <div className="modal-action">
                    <button className="btn" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-error"
                        onClick={() => {
                            setShowConfirm(false);
                            setPageIndex(0);
                        }}
                    >
                        Leave
                    </button>
                </div>
            </div>
        </div>
    );
}