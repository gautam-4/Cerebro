function Note() {
    return (
      <>
          <div className="flex-1">
              <textarea name="note" id="note" placeholder="Note" className="bg-note_color p-3 font-cursive text-lg rounded-xl border-0 resize-none text-gray-800 w-full h-40"></textarea>
          </div>
      </>
    )
  }
  
  export default Note