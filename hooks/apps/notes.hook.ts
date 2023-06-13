import { useState, useCallback, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { AppContext } from "@/contexts/apps";
import { NoteSummaryEntity, NoteEntity, KeywordEntity } from "@/models/notes.model";
import { NoteData, KeywordData } from "@/api/data/notes";
import { useWebSocket, toMessage } from "@/utils/ws.util";
import {
  fetchPostNotesApi,
  fetchGetNotesApi,
  fetchDeleteNoteApi,
  fetchPatchNoteApi,
} from "@/api/notes.api";
import { KeywordListAppStore, NoteListAppStore } from "@/stores/apps";
import { MAX_NOTE_LIST_SIZE } from "@/constants/notes.constant";
import { NoteDoesNotExist, NoteNameDuplicate } from "@/api/status";
import { TRAILING_SLASH } from "@/constants/common.constant";
import { OK, CREATED, CONNECTED, LOADING } from "@/api/status";
import { StatusChoice } from "@/utils/enums.util";

import { debounce } from "lodash";

export const useNoteList = (init: NoteSummaryEntity[]): NoteListAppStore => {
  const router = useRouter();
  const { token } = useContext(AppContext);

  const [items, setItems] = useState<NoteSummaryEntity[]>(init);
  const [offset, setOffset] = useState<number>(0);
  const [isLast, setIsLast] = useState<boolean>(true);
  
  const [readLoader, setReadLoader] = useState<boolean>(false);
  const [addLoader, setAddLoader] = useState<boolean>(false);
  const [modifyLoader, setModifyLoader] = useState<boolean>(false);
  const [removeLoader, setRemoveLoader] = useState<boolean>(false);

  useEffect(() => {
    if (items.length < MAX_NOTE_LIST_SIZE) {
      setIsLast(true);
    }
    if (items.length === 0) {
      addItem({
        name: '',
        status: StatusChoice.SAVE
      })
    }
  }, [items]);

  const nextPage = useCallback(async () => {
    const nextOffset = offset + MAX_NOTE_LIST_SIZE;
    setOffset(nextOffset);

    setReadLoader(true);
    const payload = await fetchGetNotesApi({
      offset: nextOffset
    }, token ?? '');
    setReadLoader(false);

    if (payload.status === OK) {
      const data = payload.data;
      if (data) {
        if (data.length === 0) {
          setIsLast(true);
        }
        else if (data.length >= 0 && data.length < MAX_NOTE_LIST_SIZE) {
          setItems([...items, ...data]);
          setIsLast(true);
        } else {
          setItems([...items, ...data]);
          setIsLast(false);
        }
      }
    }
  }, [offset, items]);

  const search = useCallback(debounce(async (name: string) => {
    setOffset(0);

    setReadLoader(true);
    const payload = await fetchGetNotesApi({
      name: name,
      offset: 0
    }, token ?? '');
    setReadLoader(false);

    if (payload.status === OK) {
      const data = payload.data;
      if (data) {
        if (data.length === 0) {
          setIsLast(true);
        }
        else if (data.length >= 0 && data.length < MAX_NOTE_LIST_SIZE) {
          setItems(data);
          setIsLast(true);
        } else {
          setItems(data);
          setIsLast(false);
        }
      }
    }
  }, 250), [items]);
  
  const addItem = useCallback(async (data: NoteData) => {
    setAddLoader(true);
    const payload = await fetchPostNotesApi(data, token as string);
    setAddLoader(false);

    if (payload.status !== CREATED) {
      return {
        isSuccess: false,
        status: payload.status
      }
    }

    const note: NoteEntity = payload.data!;
    router.push(`/note/${note.displayId}`);
    setItems([{
      displayId: note.displayId,
      name: note.name
    }, ...items]);

    return {
      isSuccess: true,
      status: payload.status,
      data: payload.data
    }
  }, [items]);

  const modifyItem = useCallback(async (data: NoteData, key: string) => {
    setModifyLoader(true);
    const payload = await fetchPatchNoteApi(data, key, token as string);
    setModifyLoader(false);

    if (payload.status === NoteNameDuplicate) {
      return {
        isSuccess: false,
        status: NoteNameDuplicate
      }
    } else if (payload.status === NoteDoesNotExist) {
      return {
        isSuccess: false,
        status: NoteDoesNotExist
      }
    }
    const note: NoteEntity = payload.data!;
    setItems(items.map((value) => {
      if (value.displayId === note.displayId) {
        return note;
      } else return value;
    }))

    return {
      isSuccess: true,
      status: payload.status,
      data: payload.data
    }
  }, [items]);

  const removeItem = useCallback(async (key: string) => {
    setRemoveLoader(true);
    await fetchDeleteNoteApi(key, token as string);
    setRemoveLoader(false);

    router.push('/note');

    return {
      isSuccess: true,
      status: OK
    }
  }, [items]);

  return {
    items,
    isLast,
    nextPage,
    search,
    loader: {
      read: readLoader,
      add: addLoader,
      modify: modifyLoader,
      remove: removeLoader
    },
    addItem,
    modifyItem,
    removeItem
  }
}

export const useKeywordList = (init: KeywordEntity[], noteId: number): KeywordListAppStore => {
  const { token } = useContext(AppContext);

  const [items, setItems] = useState<KeywordEntity[]>(init);

  const {
    payload: modifiedItemPayload,
    sendMessage: sendModifyMessage,
    clear: clearModifyItemPayload
  } = useWebSocket<KeywordEntity>(`/ws/notes/${noteId}/update-keyword${TRAILING_SLASH}`);

  const {
    payload: addedItemPayload,
    sendMessage: sendAddMessage,
    clear: clearAddedItemPayload
  } = useWebSocket<KeywordEntity>(`/ws/notes/${noteId}/create-keyword${TRAILING_SLASH}`);

  useEffect(() => {
    if (modifiedItemPayload.status === OK) {
      const keyword = modifiedItemPayload.data!
      setItems(items.map((value) => {
        if (value.id === keyword.id) {
          return keyword
        } else return value
      }))
      return clearModifyItemPayload();
    }
  }, [items, modifiedItemPayload]);

  useEffect(() => {
    if (addedItemPayload.status === OK) {
      const keyword = addedItemPayload.data!;
      setItems([...items, keyword]);
      return clearAddedItemPayload();
    }
  }, [items, addedItemPayload]);

  const modifyItem = useCallback(async (data: KeywordData, key: number) => {
    const message = toMessage(data, { token, key });
    sendModifyMessage(message);
  }, [items]);

  const addItem = useCallback(async (data: KeywordData) => {
    const message = toMessage(data, { token });
    sendAddMessage(message);
  }, [items]);

  return {
    items,
    modifyItem,
    addItem
  }
}
